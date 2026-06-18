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

const CHANNELS_URL = "https://iptv-org.github.io/api/channels.json";
const COUNTRIES_URL = "https://iptv-org.github.io/api/countries.json";

const LOCAL_M3U_SOURCES = [
  { name: "Sport", url: "/playlists/Sport.m3u", category: "Sports" },
];

const CATEGORY_META_DATA: Record<string, { icon: string; gradient: string }> = {
  Entertainment: { icon: "🎬", gradient: "from-pink-500 via-purple-500 to-indigo-500" },
  Sports: { icon: "🏆", gradient: "from-cyan-500 via-sky-500 to-blue-600" },
  News: { icon: "📰", gradient: "from-amber-500 via-orange-500 to-red-600" },
  Movies: { icon: "🍿", gradient: "from-violet-500 via-fuchsia-500 to-pink-600" },
  Kids: { icon: "🧸", gradient: "from-emerald-500 via-lime-500 to-cyan-500" },
  Music: { icon: "🎵", gradient: "from-teal-500 via-cyan-500 to-sky-500" },
  Documentary: { icon: "📚", gradient: "from-slate-500 via-stone-500 to-amber-500" },
  Religious: { icon: "✝️", gradient: "from-amber-500 via-rose-500 to-fuchsia-500" },
  Lifestyle: { icon: "🌿", gradient: "from-green-500 via-emerald-500 to-teal-500" },
  Business: { icon: "💼", gradient: "from-slate-600 via-indigo-600 to-cyan-500" },
};

const CATEGORY_PRIORITY: Array<[string, string]> = [
  ["sports", "Sports"],
  ["news", "News"],
  ["movie", "Movies"],
  ["film", "Movies"],
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
  if (!countryCode) return "🌍";
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return "🌍";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)));
}

function parseM3u(text: string, category: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const items: any[] = [];
  let title = "";

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#EXTINF:")) {
      const commaIndex = line.indexOf(",");
      title = commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : line;
      continue;
    }

    if (line.startsWith("#")) {
      continue;
    }

    if (title) {
      items.push({
        name: title || "Untitled channel",
        url: line,
        country: "Local",
        categories: [category],
        group: category,
        language: "Unknown",
        logo: "",
        website: undefined,
      });
      title = "";
    }
  }

  return items;
}

export function getCountryFlagUrl(countryCode: string) {
  if (!countryCode) return "https://flagcdn.com/w80/un.png";
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

function buildChannel(channel: any, countryCodeOverrides: Map<string, string>): Channel {
  const country = channel.country?.trim() || "Local";
  const countrySlug = slugify(country);
  const countryCode = (channel.country_code || countryCodeOverrides.get(countrySlug) || "").toLowerCase();
  const categories = Array.isArray(channel.categories)
    ? channel.categories.filter(Boolean).map((value: string) => value.trim())
    : [];

  const category = chooseCategory(categories, channel.group);
  const categorySlug = slugify(category);

  return {
    id: hashValue(`${channel.url}-${channel.name}-${country}`),
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
    streamUrl: channel.url,
    website: channel.website || channel.homepage || undefined,
  };
}

export function getCategorySlug(category: string) {
  return slugify(category);
}

export function getCategoryLabel(slug: string) {
  const entry = Object.keys(CATEGORY_META_DATA).find((category) => slugify(category) === slug);
  return entry || slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

export interface IptvCatalog {
  channels: Channel[];
  countries: CountryMeta[];
  categories: CategoryMeta[];
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

export function useIptvCatalog() {
  return useQuery<IptvCatalog, Error, IptvCatalog, readonly ["iptv-catalog"]>({
    queryKey: ["iptv-catalog"] as const,
    queryFn: async () => {
      const [rawChannels, rawCountries] = await Promise.all([
        fetch(CHANNELS_URL).then((res) => {
          if (!res.ok) throw new Error("Failed to load channels");
          return res.json();
        }),
        fetch(COUNTRIES_URL).then((res) => {
          if (!res.ok) throw new Error("Failed to load countries");
          return res.json();
        }),
      ]);

      const localM3uItems = await Promise.all(
        LOCAL_M3U_SOURCES.map(async (source) => {
          const response = await fetch(source.url);
          if (!response.ok) return [];
          const text = await response.text();
          return parseM3u(text, source.category);
        })
      );

      const localChannels = localM3uItems
        .flat()
        .map((item: any) => buildChannel(item, countryCodeOverrides));

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

      const channels: Channel[] = [
        ...(Array.isArray(rawChannels)
          ? rawChannels
              .map((item: any) => buildChannel(item, countryCodeOverrides))
              .filter((channel) => !!channel.streamUrl)
          : []),
        ...localChannels,
      ];

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

      return { channels, countries, categories };
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export const CATEGORY_META = Object.fromEntries(
  Object.entries(CATEGORY_META_DATA).map(([name, meta]) => [slugify(name), { name, slug: slugify(name), icon: meta.icon, gradient: meta.gradient }])
) as Record<string, { name: string; slug: string; icon: string; gradient: string }>;
