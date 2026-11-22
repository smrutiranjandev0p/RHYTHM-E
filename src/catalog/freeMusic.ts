export type FreeMusicTrack = {
  id: string;
  name: string;
  uri: string;
  artist: string;
  source: "Internet Archive";
  license: string;
  itemUrl: string;
};

type ArchiveDoc = { identifier?: string; title?: string; creator?: string | string[]; licenseurl?: string | string[] };
type ArchiveMetadata = { metadata?: { title?: string; creator?: string | string[]; licenseurl?: string | string[] }; files?: { name?: string; format?: string }[] };

const ARCHIVE = "https://archive.org";
const allowedLicense = (value: string) =>
  /creativecommons\.org\/(licenses\/(by|by-sa|by-nc|by-nc-sa)\/|publicdomain\/(mark|zero)\/)/i.test(value);

const first = (value?: string | string[]) => Array.isArray(value) ? value[0] || "" : value || "";

export async function searchFreeMusic(query: string): Promise<FreeMusicTrack[]> {
  const term = query.trim();
  if (!term) return [];
  const params = new URLSearchParams({
    q: `mediatype:audio AND (${term.replace(/[():"]/g, " " )}) AND (licenseurl:http*creativecommons.org/licenses/by/* OR licenseurl:http*creativecommons.org/licenses/by-sa/* OR licenseurl:http*creativecommons.org/licenses/by-nc/* OR licenseurl:http*creativecommons.org/licenses/by-nc-sa/* OR licenseurl:http*creativecommons.org/publicdomain/*)`,
    fl: "identifier,title,creator,licenseurl",
    rows: "18",
    page: "1",
    output: "json"
  });
  const response = await fetch(`${ARCHIVE}/advancedsearch.php?${params.toString()}`);
  if (!response.ok) throw new Error("Free music search is temporarily unavailable.");
  const payload = await response.json();
  const docs: ArchiveDoc[] = payload?.response?.docs || [];
  const tracks: FreeMusicTrack[] = [];
  for (const doc of docs.slice(0, 12)) {
    if (!doc.identifier) continue;
    try {
      const metaResponse = await fetch(`${ARCHIVE}/metadata/${encodeURIComponent(doc.identifier)}`);
      if (!metaResponse.ok) continue;
      const metadata: ArchiveMetadata = await metaResponse.json();
      const license = first(metadata.metadata?.licenseurl) || first(doc.licenseurl);
      if (!allowedLicense(license)) continue;
      const audio = (metadata.files || []).find(file =>
        /\.(mp3|ogg|m4a|flac|wav)$/i.test(file.name || "") &&
        !/\.(xml|sqlite|torrent)$/i.test(file.name || "")
      );
      if (!audio?.name) continue;
      const title = metadata.metadata?.title || doc.title || doc.identifier;
      const creator = first(metadata.metadata?.creator) || first(doc.creator) || "Unknown artist";
      tracks.push({
        id: `ia:${doc.identifier}:${audio.name}`,
        name: title,
        artist: creator,
        uri: `${ARCHIVE}/download/${encodeURIComponent(doc.identifier)}/${audio.name.split("/").map(encodeURIComponent).join("/")}`,
        source: "Internet Archive",
        license,
        itemUrl: `${ARCHIVE}/details/${encodeURIComponent(doc.identifier)}`
      });
    } catch {
      // Skip an unavailable or malformed archive item; continue with the rest.
    }
  }
  return tracks;
}
