import type {
  AudioContext,
  AudioTagHandle,
  BiquadFilterNode,
  MediaElementAudioSourceNode,
  GainNode,
} from "react-native-audio-api";
import { REELSONIC_PRESETS, type ReelsonicBand, type ReelsonicPresetId } from "./reelsonic";

export type ReelsonicGraph = {
  source: MediaElementAudioSourceNode;
  filters: BiquadFilterNode[];
  output: GainNode;
  apply: (bands: ReelsonicBand[], outputGainDb?: number) => void;
  dispose: () => void;
};

const FREQUENCIES = [60, 230, 910, 3600, 14000] as const;
const FILTER_TYPES = ["lowshelf", "peaking", "peaking", "peaking", "highshelf"] as const;

/**
 * Connects a native <Audio> tag to a real-time five-band EQ graph.
 * Call only after the Audio tag fires onLoad; each tag may be routed once.
 */
export function createReelsonicGraph(
  context: AudioContext,
  audio: AudioTagHandle,
  bands: ReelsonicBand[],
  outputGainDb = -2
): ReelsonicGraph {
  const source = context.createMediaElementSource(audio);
  const filters = FREQUENCIES.map((frequencyHz, index) => {
    const filter = context.createBiquadFilter();
    filter.type = FILTER_TYPES[index];
    filter.frequency.value = frequencyHz;
    filter.Q.value = index === 0 || index === 4 ? 0.8 : 1;
    filter.gain.value = 0;
    return filter;
  });
  const output = context.createGain();
  source.connect(filters[0]);
  for (let index = 0; index < filters.length - 1; index += 1) {
    filters[index].connect(filters[index + 1]);
  }
  filters[filters.length - 1].connect(output);
  output.connect(context.destination);

  const apply = (nextBands: ReelsonicBand[], nextOutputGainDb = -2) => {
    filters.forEach((filter, index) => {
      const band = nextBands[index];
      filter.gain.value = Math.max(-6, Math.min(6, Number(band?.gainDb) || 0));
      if (band?.frequencyHz) filter.frequency.value = band.frequencyHz;
      if (band?.q) filter.Q.value = band.q;
    });
    // Fixed headroom prevents the EQ's positive bands from needlessly clipping.
    output.gain.value = Math.pow(10, Math.min(-1, nextOutputGainDb) / 20);
  };
  apply(bands, outputGainDb);

  return {
    source,
    filters,
    output,
    apply,
    dispose: () => {
      try { source.disconnect(); } catch {}
      filters.forEach((filter) => { try { filter.disconnect(); } catch {} });
      try { output.disconnect(); } catch {}
    },
  };
}

export function presetBands(id: ReelsonicPresetId): ReelsonicBand[] {
  return REELSONIC_PRESETS[id].bands.map((band) => ({ ...band }));
}
