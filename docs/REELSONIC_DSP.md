# REELSONIC native DSP

The five-band signal graph is implemented in `src/audio/reelsonicGraph.ts` using React Native Audio API's native `MediaElementAudioSourceNode`, five `BiquadFilterNode` stages and a conservative output gain stage.

## Signal chain

`<Audio> tag → native media source → 60 Hz low shelf → 230 Hz peaking → 910 Hz peaking → 3.6 kHz peaking → 14 kHz high shelf → output gain → native destination`

The graph must be created only after the native Audio tag's `onLoad` callback. A tag can only be routed once. Live EQ updates write to each filter's AudioParam values without rebuilding the graph. The graph exposes `dispose()` for teardown.

## Integration and validation gates

- The current shared player still uses `expo-audio`; it must be migrated to the native Audio tag before this graph affects user playback.
- Preserve queue, seeking, background playback, audio focus and lock-screen controls during that migration.
- Do not label Sound Lab controls active until the shared player is routed through this graph and Android/iOS device playback is verified.
- The React Native Audio API currently does not provide DynamicsCompressorNode; no limiter or loudness normalizer is claimed.
- Test local imported files and supported remote streams, then compare bypass and EQ at matched loudness on speaker, wired and Bluetooth outputs.
