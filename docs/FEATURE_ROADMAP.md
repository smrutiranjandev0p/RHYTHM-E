# RHYTHM E — Product & Technical Roadmap

RHYTHM E combines the social, expressive, mood-led listening experience users expect from modern music apps with optional advanced audio tools. LastWave-Native is a technical reference for feature ideas; this project will use its own implementation, visual identity, and product decisions.

## Product principles

1. Music discovery and listening remain the centre of the app.
2. Advanced audio features are opt-in and understandable to casual listeners.
3. Never label a feature as working until its complete playback/backend path has been implemented and tested.
4. Use licensed catalogues, user-owned local files, or explicitly authorized sources. Do not depend on scraping private APIs or bypassing platform restrictions for a commercial release.
5. Keep the Expo/React Native app cross-platform. Add native Android/iOS modules only when a feature genuinely requires them.

## Feature map

| Feature | Product value | Priority | Implementation path |
|---|---|---:|---|
| Mood-led discovery, mixes, artist/album pages | Core Resso-like experience | P0 | App UI + catalogue/search service |
| Full player, queue, background playback, lock-screen controls | Reliable listening foundation | P0 | Native audio engine + media session |
| Synced lyrics, translation, romanization | Sing-along and accessibility | P1 | Licensed/authorized lyrics provider + timestamp sync |
| Local library scan, metadata, artwork, offline cache | User-owned music collection | P1 | Android/iOS media permissions + local database |
| Sleep timer, gapless playback, crossfade, replay gain | Everyday playback quality | P1 | Audio engine capabilities |
| Equalizer, bass boost, presets, headphone profiles | Advanced sound customization | P1 | Native DSP/equalizer layer; device support varies |
| Liquid-glass-inspired player chrome and artwork-reactive themes | Futuristic visual identity | P1 | React Native UI; graceful fallbacks |
| Listening stats, yearly rewind, taste profile | Personal discovery | P2 | On-device listening history + privacy controls |
| Listen-together rooms and shared queues | Social listening | P2 | Realtime backend, presence and sync |
| Shareable lyric/artwork cards | Social sharing | P2 | Local image composition; licensed content rules |
| Widgets, Android Auto / CarPlay integration | Convenient listening | P2 | Platform-specific native integrations |
| USB DAC / bit-perfect output, high-resolution audio | Audiophile tier | P3 | Native audio pipeline, hardware-specific validation |
| AutoEQ headphone calibration, tempo/pitch controls | Power-user tools | P3 | DSP engine + maintained headphone profile data |

## Architecture decision

The current project is Expo Router + React Native. Keep the UI and product logic shared between Android and iOS. For playback, use a maintained native-capable audio solution and a development build; Expo Go is not the final test environment for background playback, media controls, or DSP. Isolate audio operations behind a small playback service so the UI is not coupled to a specific engine.

Suggested modules:
- `src/features/player`: queue, transport state, mini-player and player UI
- `src/features/lyrics`: lyric provider interface, timestamp parser, translation display
- `src/features/library`: permissions, local scan, metadata and offline cache
- `src/features/audio-lab`: equalizer, presets, crossfade and audio settings
- `src/features/discovery`: moods, recommendations, search and artist/album pages
- `src/services/audio`: platform audio adapter and playback lifecycle
- `src/services/catalog`: authorized catalogue/provider adapters
- `src/services/sync`: account, playlist and listening-history sync

## Delivery sequence

### Stage 1 — Make listening real
- Choose and validate the audio engine for Android and iOS.
- Implement queue, play/pause/seek/next/previous and audio focus.
- Add background playback, notification/lock-screen controls and interruptions.
- Add local library permission and metadata scanning.

### Stage 2 — Lyrics and player intelligence
- Add timestamped lyrics with a provider abstraction and attribution.
- Add sleep timer, gapless playback and crossfade where supported.
- Add playback history and basic listening insights.

### Stage 3 — Sound Lab
- Add equalizer bands, presets and safe reset.
- Add loudness normalization and headphone profiles where supported.
- Clearly indicate when the device or output route does not support a control.

### Stage 4 — Social and immersive
- Add shared playlists, listening rooms and shareable cards.
- Add artwork-reactive themes, subtle haptics and optional animated backgrounds.
- Add widgets and car integrations after platform-specific testing.

## Licensing and distribution note

LastWave-Native is GPL-3.0 licensed and its README describes it as a non-commercial research/educational project. This roadmap treats it as a reference, not a code dependency. Before reusing any code, assets, or substantial implementation, review the applicable license and obligations with qualified counsel. RHYTHM E must also secure appropriate music, lyrics, artwork, and streaming rights before public distribution or monetization.

## Current status

Implemented on `development`: a shared Expo Audio player service, user-selected local audio file import, local queue, play/pause/skip/seek controls, and native background playback / lock-screen configuration. Sound Lab, app settings, listening insights, and lyrics remain interface prototypes. No online streaming catalogue, synced lyrics provider, real DSP equalizer, social listening backend, or cloud sync is implemented yet. The native audio path has not yet been built or tested on a physical device; validate it with a development build before release.
