/**
 * RHYTHM E — REELSONIC sound profile definitions.
 * These values are design targets only. They are NOT applied to Expo Audio playback.
 * Keep output gain conservative; validate DSP and true-peak headroom before activation.
 */
export type ReelsonicPresetId = "original" | "bass" | "vocal" | "air";
export type ReelsonicBand = { frequencyHz: number; gainDb: number; q: number };
export type ReelsonicPreset = {
  id: ReelsonicPresetId;
  name: string;
  description: string;
  bands: ReelsonicBand[];
  outputGainDb: number;
};

const makeBands = (gains: number[]): ReelsonicBand[] =>
  [60, 230, 910, 3600, 14000].map((frequencyHz, index) => ({
    frequencyHz,
    gainDb: gains[index],
    q: index === 0 || index === 4 ? 0.8 : 1.0,
  }));

// Gentle tone shaping only; no loudness maximisation or clipping-prone gain stage.
export const REELSONIC_PRESETS: Record<ReelsonicPresetId, ReelsonicPreset> = {
  original: {
    id: "original",
    name: "REELSONIC Original",
    description: "Balanced bass, present vocals and clean detail",
    bands: makeBands([1.5, 0.8, 0, 1.2, 0.8]),
    outputGainDb: -2,
  },
  bass: {
    id: "bass",
    name: "REELSONIC Bass",
    description: "Fuller low end without extreme sub-bass boost",
    bands: makeBands([2.5, 1.5, 0, 0.5, 0.5]),
    outputGainDb: -3,
  },
  vocal: {
    id: "vocal",
    name: "REELSONIC Vocal",
    description: "Clearer vocal presence with restrained low mids",
    bands: makeBands([-1, 0, 1.5, 2, 0.8]),
    outputGainDb: -2,
  },
  air: {
    id: "air",
    name: "REELSONIC Air",
    description: "A little extra presence and high-frequency openness",
    bands: makeBands([-0.5, -0.5, 0, 1.5, 2]),
    outputGainDb: -2,
  },
};

export const REELSONIC_BYPASS_LABEL = "Original audio (DSP bypass)";
export const REELSONIC_IMPLEMENTATION_STATUS = "design-only" as const;
