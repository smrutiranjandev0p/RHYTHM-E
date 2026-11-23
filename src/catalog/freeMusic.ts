export type FreeMusicTrack = {
  id: string;
  name: string;
  uri: string;
  artist: string;
  source: "Audius" | "Internet Archive";
  license: string;
  rightsLabel: string;
  itemUrl: string;
  artworkUrl?: string;
  duration?: number;
};

type ArchiveDoc = { identifier?: string; title?: string; creator?: string | string[]; licenseurl?: string | string[] };
type ArchiveMetadata = { metadata?: { title?: string; creator?: string | string[]; licenseurl?: string | string[] }; files?: { name?: string; format?: string }[] };

const ARCHIVE = "https://archive.org";
const AUDIUS = "https://api.audius.co/v1";
const REQUEST_TIMEOUT_MS = 12_000;
const allowedLicense = (value: string) =>
  /creativecommons\.org\/(licenses\/(by|by-sa|by-nc|by-nc-sa)\/|publicdomain\/(mark|zero)\/)/i.test(value);

const first = (value?: string | string[]) => Array.isArray(value) ? value[0] || "" : value || "";

type AudiusTrack = {
  id?: string;
  title?: string;
  duration?: number;
  genre?: string;
  permalink?: string;
  user?: { name?: string; handle?: string };
  artwork?: { [size: string]: string | undefined };
  downloadable?: boolean;
  is_stream_gated?: boolean;
  is_streamable?: boolean;
};

async function requestJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { "Api-User-Agent": "RHYTHM-E/1.0 (open music discovery)" } });
    if (!response.ok) throw new Error(`Catalogue request failed (${response.status}).`);
    return await response.json() as T;
  } finally {
    clearTimeout(timer);
  }
}

const uniqueTracks = (tracks: FreeMusicTrack[]) => {
  const seen = new Set<string>();
  return tracks.filter(track => {
    const key = `${track.name}\u0000${track.artist}`.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Searches music creators who explicitly make their work available through
 * Audius' public read/stream API. Playback stays inside the shared Expo player
 * and does not use scraped or extracted third-party media URLs.
 */
export async function searchAudiusMusic(query: string): Promise<FreeMusicTrack[]> {
  const term = query.trim();
  if (!term) return [];
  const payload = await requestJson<{ data?: AudiusTrack[] }>(
    `${AUDIUS}/tracks/search?query=${encodeURIComponent(term)}&limit=24`
  );
  return (payload.data || [])
    .filter(track => track.id && track.title && !track.is_stream_gated && track.is_streamable !== false)
    .slice(0, 18)
    .map(track => ({
      id: `audius:${track.id}`,
      name: track.title!.trim(),
      artist: track.user?.name?.trim() || track.user?.handle?.trim() || "Audius creator",
      uri: `${AUDIUS}/tracks/${encodeURIComponent(track.id!)}/stream`,
      source: "Audius" as const,
      license: "Creator-published Audius stream; check the source page for usage terms.",
      rightsLabel: "Creator-published stream · usage terms vary",
      itemUrl: track.permalink ? `https://audius.co/${track.permalink}` : "https://audius.co",
      artworkUrl: track.artwork?.["480x480"] || track.artwork?.["150x150"] || track.artwork?.["1000x1000"],
      duration: typeof track.duration === "number" ? track.duration : undefined
    }));
}

export async function searchArchiveMusic(query: string): Promise<FreeMusicTrack[]> {
  const term = query.trim();
  if (!term) return [];
  const params = new URLSearchParams({
    q: `mediatype:audio AND (${term.replace(/[():"]/g, " ")}) AND (licenseurl:http*creativecommons.org/licenses/by/* OR licenseurl:http*creativecommons.org/licenses/by-sa/* OR licenseurl:http*creativecommons.org/licenses/by-nc/* OR licenseurl:http*creativecommons.org/licenses/by-nc-sa/* OR licenseurl:http*creativecommons.org/publicdomain/*)`,
    fl: "identifier,title,creator,licenseurl",
    rows: "18",
    page: "1",
    output: "json"
  });
  ["identifier", "title", "creator", "licenseurl"].forEach(field => params.append("fl[]", field));
  const payload = await requestJson<{ response?: { docs?: ArchiveDoc[] } }>(`${ARCHIVE}/advancedsearch.php?${params.toString()}`);
  const docs: ArchiveDoc[] = payload?.response?.docs || [];
  const candidates = await Promise.all(docs.slice(0, 12).map(async (doc): Promise<FreeMusicTrack | null> => {
    const identifier = doc.identifier;
    if (!identifier) return null;
    try {
      const metadata = await requestJson<ArchiveMetadata>(`${ARCHIVE}/metadata/${encodeURIComponent(identifier)}`);
      const license = first(metadata.metadata?.licenseurl) || first(doc.licenseurl);
      if (!allowedLicense(license)) return null;
      const audio = (metadata.files || []).find(file =>
        /\.(mp3|ogg|m4a|flac|wav)$/i.test(file.name || "") &&
        !/\.(xml|sqlite|torrent)$/i.test(file.name || "")
      );
      if (!audio?.name) return null;
      const title = metadata.metadata?.title || doc.title || identifier;
      const creator = first(metadata.metadata?.creator) || first(doc.creator) || "Unknown artist";
      return {
        id: `ia:${identifier}:${audio.name}`,
        name: title,
        artist: creator,
        uri: `${ARCHIVE}/download/${encodeURIComponent(identifier)}/${audio.name.split("/").map(encodeURIComponent).join("/")}`,
        source: "Internet Archive",
        license,
        rightsLabel: `Internet Archive · ${license.split("/").filter(Boolean).slice(-2).join(" ")}`,
        itemUrl: `${ARCHIVE}/details/${encodeURIComponent(identifier)}`
      };
    } catch {
      return null;
    }
  }));
  return candidates.filter((track): track is FreeMusicTrack => track !== null);
}

/**
 * A best-effort online catalogue. A single upstream outage no longer makes
 * search unusable: tracks from the surviving source are still playable.
 */
export async function searchFreeMusic(query: string): Promise<FreeMusicTrack[]> {
  const [audius, archive, commons] = await Promise.allSettled([
    searchAudiusMusic(query),
    searchArchiveMusic(query)
  ]);
  const results = [
    ...(audius.status === "fulfilled" ? audius.value : []),
    ...(archive.status === "fulfilled" ? archive.value : [])
  ];
  if (!results.length) {
    throw new Error("Online music search is temporarily unavailable. Check your connection and try again.");
  }
  return uniqueTracks(results).slice(0, 30);
}
