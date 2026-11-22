export type LyricsResult = {
  trackName: string;
  artistName: string;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  instrumental?: boolean;
};

export async function findLyrics(trackName: string, artistName: string, duration?: number): Promise<LyricsResult | null> {
  const params = new URLSearchParams({ track_name: trackName, artist_name: artistName });
  if (duration && duration > 0) params.set("duration", String(Math.round(duration)));
  const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
    headers: { "X-User-Agent": "RHYTHM E/1.0 (https://github.com/smrutiranjandev0p/RHYTHM-E)" }
  });
  if (response.status === 404) return null;
  if (response.status === 429) throw new Error("Lyrics service is busy. Please wait before trying again.");
  if (!response.ok) throw new Error("Lyrics could not be loaded right now.");
  return response.json();
}

export type TimedLyric = { time: number; text: string };

export function parseSyncedLyrics(value: string): TimedLyric[] {
  return value.split(/\r?\n/).flatMap(line => {
    const matches = [...line.matchAll(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g)];
    const text = line.replace(/\[\d{2}:\d{2}(?:\.\d{1,3})?\]/g, "").trim();
    return matches.map(match => ({
      time: Number(match[1]) * 60 + Number(match[2]) + Number(`0.${(match[3] || "0").padEnd(3, "0")}`),
      text
    }));
  }).sort((a, b) => a.time - b.time);
}
