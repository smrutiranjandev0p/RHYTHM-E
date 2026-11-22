# REELSONIC — DSP implementation plan

## Honest status

REELSONIC profile targets and the Sound Lab preview are committed, but **no DSP is active in playback**. The current shared player uses `expo-audio`; its public player API does not expose an insertable processing graph for EQ, compression or limiting. Do not display an “active” state until processed audio is actually reaching the output.

## Engine direction

Evaluate **React Native Audio API** as the cross-platform audio graph. Expo's SDK 58 audio documentation explicitly recommends it for advanced audio graphs and real-time effects. It requires a development build (it is not included in Expo Go). Its current API surface must be checked for required nodes and streaming/local-file support before replacing the player.

Official references:
- Expo Audio SDK 58: https://docs.expo.dev/versions/v58.0.0/sdk/audio/
- React Native Audio API setup: https://docs.swmansion.com/react-native-audio-api/docs/fundamentals/getting-started/
- React Native Audio API Expo plugin: https://docs.swmansion.com/react-native-audio-api/docs/other/audio-api-plugin/

## Required integration gates

1. Prove local imported-file decoding and continuous playback on Android and iOS.
2. Build a five-band EQ graph (60, 230, 910, 3,600 and 14,000 Hz) with parameter updates that do not interrupt playback.
3. Add preset selection and a true bypass path; compare at matched perceived loudness.
4. Preserve queue, seek, track completion, audio focus, background playback and lock-screen controls. If the new engine cannot preserve these, do not replace the existing player yet.
5. Add conservative gain staging and a verified peak-control stage before enabling any loudness enhancement. The current React Native Audio API package lists DynamicCompressorNode as planned, so do not assume a built-in compressor/limiter exists.
6. Validate speaker, wired headset and Bluetooth routes on physical Android and iOS devices; report unsupported paths clearly.

## Initial sound targets

The profiles in `src/audio/reelsonic.ts` are intentionally gentle EQ starting points with negative output headroom. They are not claims about Instagram's proprietary processing and cannot make a poorly mastered or low-bitrate source lossless. User volume and device output processing remain separate from app DSP.

## Safety and quality

- Never equate “better” with simply louder.
- Keep a bypass switch and reset-to-original action.
- Avoid aggressive bass/high-frequency boosts that can cause distortion or listening fatigue.
- Match loudness when comparing processed and bypassed audio.
- Do not enable a “normalizer”, “limiter” or “spatial” feature until its signal path and behaviour are implemented and measured.
