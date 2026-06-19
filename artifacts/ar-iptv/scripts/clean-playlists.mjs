import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const outputDir = path.join(workspaceRoot, "artifacts", "ar-iptv", "public", "playlists");

const sources = [
  {
    input: "D:\\m3u chennel\\m3u chennel\\Sport_Clean.m3u",
    output: "Sport_Clean.m3u",
    adultOnly: false,
  },
  {
    input: "D:\\m3u chennel\\m3u chennel\\Fifa world cup.m3u",
    output: "Fifa-world-cup.m3u",
    adultOnly: false,
  },
  {
    input: "D:\\m3u chennel\\m3u chennel\\Adult_Only.m3u",
    output: null,
    adultOnly: true,
  },
];

const checkLinks = !process.argv.includes("--no-check");
const concurrency = Number(process.env.PLAYLIST_CHECK_CONCURRENCY || 32);
const timeoutMs = Number(process.env.PLAYLIST_CHECK_TIMEOUT_MS || 4500);
const adultPattern = /\b(adult|adulte|xxx|18\+|porn|erotic|sex)\b/i;

function parseAttributes(line) {
  const attrs = {};
  const attrPattern = /([\w-]+)="([^"]*)"/g;
  let match;
  while ((match = attrPattern.exec(line))) {
    attrs[match[1].toLowerCase()] = match[2].trim();
  }
  return attrs;
}

function parseM3u(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let extinf = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#EXTINF:")) {
      extinf = line;
      continue;
    }
    if (line.startsWith("#")) continue;
    if (extinf) {
      const attrs = parseAttributes(extinf);
      entries.push({
        extinf,
        url: line,
        group: attrs["group-title"] || "",
      });
      extinf = "";
    }
  }

  return entries;
}

function isAdultEntry(entry) {
  return adultPattern.test(entry.group) || adultPattern.test(entry.extinf);
}

async function probe(entry) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(entry.url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status === 404 || response.status === 410) {
      return { keep: false, reason: `HTTP ${response.status}` };
    }
    return { keep: true, reason: `HTTP ${response.status}` };
  } catch (error) {
    const code = error?.cause?.code || error?.code || "";
    if (code === "ECONNREFUSED") {
      return { keep: false, reason: code };
    }
    return { keep: true, reason: error?.name || "uncertain" };
  } finally {
    clearTimeout(timer);
  }
}

async function filterLive(entries) {
  if (!checkLinks) return entries;

  const kept = [];
  let index = 0;
  let removed = 0;

  async function worker() {
    while (index < entries.length) {
      const current = entries[index];
      index += 1;
      const result = await probe(current);
      if (result.keep) {
        kept.push(current);
      } else {
        removed += 1;
        console.log(`Removed ${current.url} (${result.reason})`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  console.log(`Checked ${entries.length} entries, removed ${removed}.`);
  return kept;
}

function renderM3u(entries) {
  return ["#EXTM3U", ...entries.flatMap((entry) => [entry.extinf, entry.url]), ""].join("\n");
}

await mkdir(outputDir, { recursive: true });

const normalOutputs = new Map();
const hdPlusEntries = [];
const adultOnlyEntries = [];

for (const source of sources) {
  const text = await readFile(source.input, "utf8");
  const entries = parseM3u(text);
  const normalEntries = [];

  for (const entry of entries) {
    if (source.adultOnly || isAdultEntry(entry)) {
      hdPlusEntries.push(entry);
      if (source.adultOnly) {
        adultOnlyEntries.push(entry);
      }
    } else {
      normalEntries.push(entry);
    }
  }

  if (source.output) {
    normalOutputs.set(source.output, normalEntries);
  }
}

for (const [filename, entries] of normalOutputs) {
  const liveEntries = await filterLive(entries);
  await writeFile(path.join(outputDir, filename), renderM3u(liveEntries), "utf8");
  console.log(`Wrote ${filename}: ${liveEntries.length} entries.`);
}

const liveHdPlusEntries = await filterLive(hdPlusEntries);
await writeFile(path.join(outputDir, "HDPlus.m3u"), renderM3u(liveHdPlusEntries), "utf8");
console.log(`Wrote HDPlus.m3u: ${liveHdPlusEntries.length} entries.`);

await writeFile(path.join(outputDir, "Adult_Only.m3u"), renderM3u(adultOnlyEntries), "utf8");
console.log(`Wrote Adult_Only.m3u: ${adultOnlyEntries.length} entries.`);
