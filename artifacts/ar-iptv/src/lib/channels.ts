import { useQuery } from "@tanstack/react-query";

export interface Channel {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  countrySlug: string;
  countryFlag: string;
  category: string;
  categorySlug: string;
  categories: string[];
  language: string;
  logo: string;
  streamUrl: string;
  website?: string;
  isHdPlus?: boolean;
}

export interface CountryMeta {
  country: string;
  countrySlug: string;
  countryCode: string;
  countryFlag: string;
  count: number;
}

export interface CategoryMeta {
  name: string;
  slug: string;
  icon: string;
  gradient: string;
  count: number;
}

export interface IptvCatalog {
  channels: Channel[];
  hdPlusChannels: Channel[];
  countries: CountryMeta[];
  categories: CategoryMeta[];
}

const CHANNELS_URL = "https://iptv-org.github.io/api/channels.json";
const COUNTRIES_URL = "https://iptv-org.github.io/api/countries.json";

const LOCAL_M3U_SOURCES = [
  { name: "Sport Clean", url: "/playlists/Sport_Clean.m3u", category: "Sports" },
  { name: "FIFA World Cup", url: "/playlists/Fifa-world-cup.m3u", category: "Sports" },
];

const HD_PLUS_M3U_SOURCES = [
  { name: "HD+", url: "/playlists/HDPlus.m3u", category: "HD+" },
];

const CATEGORY_META_DATA: Record<string, { icon: string; gradient: string }> = {
  Entertainment: { icon: "TV", gradient: "from-pink-500 via-fuchsia-500 to-indigo-500" },
  Sports: { icon: "SP", gradient: "from-cyan-500 via-sky-500 to-blue-600" },
  News: { icon: "NW", gradient: "from-amber-500 via-orange-500 to-red-600" },
  Movies: { icon: "MV", gradient: "from-violet-500 via-fuchsia-500 to-pink-600" },
  Kids: { icon: "KD", gradient: "from-emerald-500 via-lime-500 to-cyan-500" },
  Music: { icon: "MS", gradient: "from-teal-500 via-cyan-500 to-sky-500" },
  Documentary: { icon: "DC", gradient: "from-slate-500 via-stone-500 to-amber-500" },
  Religious: { icon: "RL", gradient: "from-amber-500 via-rose-500 to-fuchsia-500" },
  Lifestyle: { icon: "LS", gradient: "from-green-500 via-emerald-500 to-teal-500" },
  Business: { icon: "BZ", gradient: "from-slate-600 via-indigo-600 to-cyan-500" },
};

const CATEGORY_PRIORITY: Array<[string, string]> = [
  ["sports", "Sports"],
  ["sport", "Sports"],
  ["news", "News"],
  ["movie", "Movies"],
  ["film", "Movies"],
  ["cinema", "Movies"],
  ["kids", "Kids"],
  ["children", "Kids"],
  ["music", "Music"],
  ["documentary", "Documentary"],
  ["religion", "Religious"],
  ["faith", "Religious"],
  ["lifestyle", "Lifestyle"],
  ["travel", "Lifestyle"],
  ["culture", "Lifestyle"],
  ["business", "Business"],
  ["economy", "Business"],
  ["entertainment", "Entertainment"],
];

const ISO3_TO_ISO2: Record<string, string> = {
  AFG: "af",
  ALB: "al",
  ALG: "dz",
  AND: "ad",
  ARE: "ae",
  ARG: "ar",
  ARM: "am",
  AUS: "au",
  AUT: "at",
  AZE: "az",
  BEL: "be",
  BGD: "bd",
  BGR: "bg",
  BHR: "bh",
  BIH: "ba",
  BRA: "br",
  CAN: "ca",
  CHE: "ch",
  CHL: "cl",
  CHN: "cn",
  COL: "co",
  CZE: "cz",
  DEU: "de",
  DNK: "dk",
  DZA: "dz",
  ECU: "ec",
  ESP: "es",
  FIN: "fi",
  FRA: "fr",
  GBR: "gb",
  GRC: "gr",
  HND: "hn",
  HRV: "hr",
  HUN: "hu",
  IDN: "id",
  IND: "in",
  IRL: "ie",
  IRN: "ir",
  IRQ: "iq",
  ISR: "il",
  ITA: "it",
  JOR: "jo",
  KOR: "kr",
  KWT: "kw",
  LBN: "lb",
  LBY: "ly",
  MAR: "ma",
  MKD: "mk",
  MLT: "mt",
  MUS: "mu",
  MEX: "mx",
  MYS: "my",
  NLD: "nl",
  NOR: "no",
  NZL: "nz",
  PAK: "pk",
  PER: "pe",
  PHL: "ph",
  POL: "pl",
  PRT: "pt",
  ROU: "ro",
  RUS: "ru",
  SAU: "sa",
  SWE: "se",
  SYR: "sy",
  TUR: "tr",
  UKR: "ua",
  USA: "us",
  YEM: "ye",
  ZAF: "za",
};

const COUNTRY_ALIASES: Record<string, string> = {
  africa: "International",
  arabic: "International",
  ar: "International",
  car: "International",
  exyu: "International",
  "ex-yu": "International",
  "ex yugoslavia": "International",
  "ex-yugoslavia": "International",
  general: "International",
  ku: "International",
  "latin america": "International",
  lib: "Lebanon",
  music: "International",
  mybox: "International",
  myfhd: "International",
  "myfhd sports": "International",
  myhd: "International",
  "myhd kids": "International",
  "myhd kidz": "International",
  su: "International",
  uae: "United Arab Emirates",
  usa: "United States",
};

const COUNTRY_NAME_TO_ISO2: Record<string, string> = {
  albania: "al",
  argentina: "ar",
  australia: "au",
  austria: "at",
  bangladesh: "bd",
  belgium: "be",
  brazil: "br",
  canada: "ca",
  chile: "cl",
  china: "cn",
  col: "co",
  "czech republic": "cz",
  denmark: "dk",
  finland: "fi",
  france: "fr",
  germany: "de",
  greece: "gr",
  hungary: "hu",
  india: "in",
  indonesia: "id",
  italy: "it",
  malaysia: "my",
  netherlands: "nl",
  norway: "no",
  pakistan: "pk",
  philippines: "ph",
  poland: "pl",
  portugal: "pt",
  romania: "ro",
  russia: "ru",
  "south africa": "za",
  spain: "es",
  sweden: "se",
  turkey: "tr",
  "united arab emirates": "ae",
  "united states": "us",
};

const NON_COUNTRY_GROUPS = new Set([
  "general",
  "international",
  "kids",
  "music",
  "mybox",
  "myfhd",
  "myfhd sports",
  "myhd",
  "myhd kids",
  "myhd kidz",
]);

const ADULT_GROUP_PATTERN = /\b(adult|xxx|18\+|porn|erotic|sex)\b/i;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[’'“”]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashValue(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function getEmojiFlag(countryCode: string) {
  if (!countryCode) return "🌐";
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)));
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getRegionName(countryCode: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode.toUpperCase()) || countryCode.toUpperCase();
  } catch {
    return countryCode.toUpperCase();
  }
}

function parseAttributes(line: string) {
  const attrs: Record<string, string> = {};
  const attrPattern = /([\w-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(line))) {
    attrs[match[1].toLowerCase()] = match[2].trim();
  }
  return attrs;
}

function isAdultGroup(value = "") {
  return ADULT_GROUP_PATTERN.test(value);
}

function resolveCountry(rawValue: string | undefined, countryCodeOverrides: Map<string, string>) {
  const raw = (rawValue || "").replace(/^\*/, "").trim();
  const normalized = slugify(raw);
  const upper = raw.toUpperCase();

  if (!raw || NON_COUNTRY_GROUPS.has(normalized)) {
    return { country: "International", countryCode: "un" };
  }

  const alias = COUNTRY_ALIASES[normalized];
  if (alias) {
    const aliasCode = COUNTRY_NAME_TO_ISO2[slugify(alias)] || countryCodeOverrides.get(slugify(alias)) || "";
    return { country: alias, countryCode: aliasCode || (alias === "International" ? "un" : "") };
  }

  if (upper.length === 2 && /^[A-Z]{2}$/.test(upper)) {
    const countryCode = upper.toLowerCase();
    return { country: getRegionName(countryCode), countryCode };
  }

  const iso2FromIso3 = ISO3_TO_ISO2[upper];
  if (iso2FromIso3) {
    return { country: getRegionName(iso2FromIso3), countryCode: iso2FromIso3 };
  }

  const countryCode = COUNTRY_NAME_TO_ISO2[normalized] || countryCodeOverrides.get(normalized) || "";
  if (countryCode) {
    return { country: getRegionName(countryCode), countryCode };
  }

  if (raw.length > 2 && !isAdultGroup(raw)) {
    return { country: toTitleCase(raw), countryCode: "" };
  }

  return { country: "International", countryCode: "un" };
}

function parseM3u(text: string, source: { category: string; forceHdPlus?: boolean }) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const items: any[] = [];
  let pending: any = null;

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#EXTINF:")) {
      const commaIndex = line.indexOf(",");
      const attrs = parseAttributes(line);
      const title = commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : attrs["tvg-name"] || "Untitled channel";
      const group = attrs["group-title"] || "";
      pending = {
        name: title || attrs["tvg-name"] || "Untitled channel",
        countryHint: attrs["tvg-country"] || group,
        categories: [source.category],
        group,
        language: attrs["tvg-language"] || "Unknown",
        logo: attrs["tvg-logo"] || "",
        isHdPlus: !!source.forceHdPlus || isAdultGroup(group),
      };
      continue;
    }

    if (line.startsWith("#")) continue;

    if (pending) {
      items.push({
        ...pending,
        url: line,
      });
      pending = null;
    }
  }

  return items;
}

export function getCountryFlagUrl(countryCode: string) {
  if (!countryCode || countryCode === "un") return "https://flagcdn.com/w80/un.png";
  return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
}

function chooseCategory(rawCategories: string[] = [], group?: string) {
  const normalized = [...rawCategories, group || ""].filter(Boolean).map((value) => value.toLowerCase());

  for (const [needle, label] of CATEGORY_PRIORITY) {
    if (normalized.some((value) => value.includes(needle))) {
      return label;
    }
  }

  return "Entertainment";
}

function buildChannel(channel: any, countryCodeOverrides: Map<string, string>, options: { forceHdPlus?: boolean } = {}): Channel {
  const isHdPlus = !!options.forceHdPlus || !!channel.isHdPlus || isAdultGroup(channel.group) || isAdultGroup(channel.category);
  const resolved = isHdPlus
    ? { country: "HD+", countryCode: "un" }
    : resolveCountry(channel.countryHint || channel.country || channel.country_code || channel.group, countryCodeOverrides);
  const country = resolved.country;
  const countrySlug = slugify(country);
  const countryCode = (channel.country_code || resolved.countryCode || countryCodeOverrides.get(countrySlug) || "").toLowerCase();
  const categories = Array.isArray(channel.categories)
    ? channel.categories.filter(Boolean).map((value: string) => value.trim())
    : [];
  const category = isHdPlus ? "HD+" : chooseCategory(categories, channel.group);
  const categorySlug = slugify(category);
  const streamUrl = channel.url || channel.streamUrl || "";

  return {
    id: hashValue(`${isHdPlus ? "hd-plus" : "normal"}-${streamUrl}-${channel.name}-${country}`),
    name: (channel.name || channel.channel || "Unknown channel").trim(),
    country,
    countryCode,
    countrySlug,
    countryFlag: getEmojiFlag(countryCode),
    category,
    categorySlug,
    categories,
    language: Array.isArray(channel.language)
      ? channel.language.filter(Boolean).join(", ")
      : typeof channel.language === "string"
      ? channel.language
      : "Multilingual",
    logo: channel.logo || "",
    streamUrl,
    website: channel.website || channel.homepage || undefined,
    isHdPlus,
  };
}

async function fetchM3uItems(sources: Array<{ name: string; url: string; category: string; forceHdPlus?: boolean }>) {
  const results = await Promise.all(
    sources.map(async (source) => {
      const response = await fetch(source.url);
      if (!response.ok) return [];
      const text = await response.text();
      return parseM3u(text, source);
    })
  );
  return results.flat();
}

export function getCategorySlug(category: string) {
  return slugify(category);
}

export function getCategoryLabel(slug: string) {
  const entry = Object.keys(CATEGORY_META_DATA).find((category) => slugify(category) === slug);
  return entry || slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

export function searchChannels(channels: Channel[], query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return channels;

  return channels.filter((channel) => {
    return [channel.name, channel.country, channel.category, channel.language, channel.website]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(term));
  });
}

export function filterChannelsByLetter(channels: Channel[], letter: string) {
  if (!letter || letter === "All") return channels;
  return channels.filter((channel) => channel.name.toUpperCase().startsWith(letter.toUpperCase()));
}

async function loadCatalog(): Promise<IptvCatalog> {
  const [rawChannels, rawCountries, localM3uItems, hdPlusM3uItems] = await Promise.all([
    fetch(CHANNELS_URL)
      .then(async (res) => (res.ok ? res.json() : []))
      .catch(() => []),
    fetch(COUNTRIES_URL)
      .then(async (res) => (res.ok ? res.json() : []))
      .catch(() => []),
    fetchM3uItems(LOCAL_M3U_SOURCES).catch(() => []),
    fetchM3uItems(HD_PLUS_M3U_SOURCES.map((source) => ({ ...source, forceHdPlus: true }))).catch(() => []),
  ]);

  const countryCodeOverrides = new Map<string, string>();
  if (Array.isArray(rawCountries)) {
    rawCountries.forEach((country: any) => {
      const name = country.name?.trim();
      const code = (country.code || country.alpha2 || "").toLowerCase();
      if (name && code) {
        countryCodeOverrides.set(slugify(name), code);
      }
    });
  }

  const remoteChannels = Array.isArray(rawChannels)
    ? rawChannels
        .map((item: any) => buildChannel(item, countryCodeOverrides))
        .filter((channel) => !!channel.streamUrl && !channel.isHdPlus)
    : [];

  const localChannels = localM3uItems
    .map((item: any) => buildChannel(item, countryCodeOverrides))
    .filter((channel) => !!channel.streamUrl && !channel.isHdPlus);

  const hdPlusChannels = [
    ...localM3uItems
      .map((item: any) => buildChannel(item, countryCodeOverrides, { forceHdPlus: item.isHdPlus }))
      .filter((channel) => !!channel.streamUrl && channel.isHdPlus),
    ...hdPlusM3uItems
      .map((item: any) => buildChannel(item, countryCodeOverrides, { forceHdPlus: true }))
      .filter((channel) => !!channel.streamUrl),
  ];

  const channels = [...remoteChannels, ...localChannels];

  const countryMap = new Map<string, CountryMeta>();
  channels.forEach((channel) => {
    const existing = countryMap.get(channel.countrySlug);
    const next: CountryMeta = {
      country: channel.country,
      countrySlug: channel.countrySlug,
      countryCode: channel.countryCode,
      countryFlag: channel.countryFlag,
      count: (existing?.count ?? 0) + 1,
    };
    countryMap.set(channel.countrySlug, next);
  });

  const countries = Array.from(countryMap.values()).sort((a, b) => a.country.localeCompare(b.country));

  const categories: CategoryMeta[] = Object.entries(CATEGORY_META_DATA).map(([name, meta]) => ({
    name,
    slug: slugify(name),
    icon: meta.icon,
    gradient: meta.gradient,
    count: channels.filter((channel) => channel.category === name).length,
  }));

  return { channels, hdPlusChannels, countries, categories };
}

export function useIptvCatalog() {
  return useQuery<IptvCatalog, Error, IptvCatalog, readonly ["iptv-catalog"]>({
    queryKey: ["iptv-catalog"] as const,
    queryFn: loadCatalog,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useHdPlusCatalog() {
  return useIptvCatalog();
}

export const CATEGORY_META = Object.fromEntries(
  Object.entries(CATEGORY_META_DATA).map(([name, meta]) => [slugify(name), { name, slug: slugify(name), icon: meta.icon, gradient: meta.gradient }])
) as Record<string, { name: string; slug: string; icon: string; gradient: string }>;
