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
| Mood-led discovery, vertical swipe-to-play Flow feed, mixes, artist/album pages | Core Resso-like experience | P0 | App UI + catalogue/search service |
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

## REELSONIC audio quality milestone

REELSONIC is the planned sound signature: gentle low-end weight, clear vocal presence, controlled high-frequency detail and safe output headroom. Initial preset targets live in `src/audio/reelsonic.ts`; they are design data only and do not alter playback. The current Expo Audio player does not expose an insertable DSP graph. See `docs/REELSONIC_DSP.md` for the React Native Audio API evaluation, integration gates and physical-device validation plan.


## Licensed catalogue milestone

The current product direction is a free-to-use, non-commercial, LastWave-inspired player, prioritising local playback, open-source audio tools and verified public-domain/Creative Commons discovery. This does not grant access to commercial music for free. A licensed on-demand catalogue remains a possible future expansion only if separately chosen and funded. See `docs/LASTWAVE_INSPIRED_NONCOMMERCIAL_PLAN.md` for the current direction and `docs/LICENSED_CATALOGUE_IMPLEMENTATION.md` for the alternative licensed path.

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

Implemented on `development`: five-tab navigation with Search and Flow, persistent mini-player, a vertical swipe-to-play local music feed with animated abstract artwork, progress display and in-session favourites, automatic next-track playback, shared Expo Audio player service, user-selected local audio import, local queue, play/pause/skip/seek controls, and native background playback / lock-screen configuration. Flow browses the shared playback queue, including permitted Internet Archive selections. On-device AsyncStorage now persists track metadata, favourites and recent listening history; player selection is restored without automatically starting playback. Library includes artist and album groupings with dedicated detail pages, a queue drawer is available in the player, and the Sound Lab sleep timer pauses playback when its timer expires. Imported local audio is copied into private app Documents storage. Library now supports editing title, artist and album metadata. Artist/album pages group the available track metadata; automatic device library indexing remains future work. No online streaming catalogue, synced lyrics provider, real DSP equalizer, social listening backend, or cloud sync is implemented yet. The current direction is documented in `docs/LASTWAVE_INSPIRED_NONCOMMERCIAL_PLAN.md`. The native audio path has not yet been built or tested on a physical device; validate it with a development build before release.


## Free-source integration update — November 2026

Implemented on `development`:
- Internet Archive discovery via Advanced Search, followed by item metadata lookup and a Creative Commons/Public Domain licence URL check before a result is offered for playback.
- Direct audio playback of selected permitted archive files through the existing shared Expo Audio player and queue.
- Source item link and licence URL are shown with each result so users can review attribution and terms.
- Official YouTube search hand-off opens YouTube's own app/site. It is not an embedded player and RHYTHM E does not extract or relay YouTube audio.
- LRCLIB lookup for lyrics and line highlighting based on the current playback position when timestamped lyrics exist.
- Flow favourites are shared with the Library during the current app session.

Still not complete or validated:
- Internet Archive is a user-uploaded archive; metadata licence declarations are not independently verified by RHYTHM E. Review each source item before use.
- A native YouTube player integration is not included; official YouTube playback stays in YouTube.
- On-device persistence covers track metadata, favourites and recent history; imported local files are copied into private app Documents storage. Automatic device library indexing is not implemented.
- REELSONIC controls remain design/preset UI only; no actual audio DSP is active. Sleep timer is connected to playback.
- Background playback and lock-screen controls are configured but need an Android development build and physical-device testing.
- No build, typecheck, or device test was run as part of this phone-only GitHub update.


## Library persistence and artist/album browsing — November 2026

Implemented on `development`:
- Added AsyncStorage-backed persistence for track metadata, favourites, recent plays and the last selected track.
- Restores the selected track and lock-screen metadata on app launch without automatically starting audio.
- Added Library artist and album groupings with dedicated artist and album track-list pages. Album groupings use available metadata and place tracks without an album tag under `Singles`.
- Added a player queue drawer and connected Sound Lab sleep timer to the shared playback service.

Limitations to address during laptop QA: verify copying and playback after force-stop/relaunch, large-file behaviour and low-storage errors. Old picker-cache tracks are migrated on startup only when their source files are still accessible. Artist and album pages are metadata-based views, not a remote artist catalogue.


## Permanent audio storage and editable tags — November 2026

Implemented on `development`:
- Added `expo-file-system` SDK 58 integration using the app's private Documents directory.
- User-selected local audio is copied into `Documents/rhythm-e-library` before its track record is added to the library. Playback points to the app-managed copy rather than the document picker's temporary cache.
- Added an in-app metadata editor for track title, artist and album. Changes update the persisted library record and recent-history entries.
- Files remain private to the app sandbox; they are not uploaded or made public. They may be removed when the app is uninstalled or its app data is cleared.

Still required:
- Verify file copying, playback after force-stop/relaunch, large-file behaviour, low-storage errors and app reinstall behaviour on physical Android/iOS devices.
- Add deletion/cleanup UI and metadata extraction/tag writing if desired.
- REELSONIC DSP is not activated. Expo Audio does not provide an insertable signal graph. The next engine candidate is React Native Audio API with five biquad filters, but changing the playback engine must preserve queue, seek, background audio and lock-screen controls. This migration requires a native development build and device QA; do not mark the EQ active before that is complete.


## Current DSP status — November 2026

The five-band EQ UI remains a preview, not an active effect. React Native Audio API is the candidate engine because it exposes `BiquadFilterNode` and a native `<Audio>` source that can be routed through a graph. However, the existing shared player currently uses Expo Audio. A production-safe migration must replace the player transport and retain background playback, lock-screen notifications, queue, seek, audio focus and interruption handling. The native dependency requires a development build and device testing. This cannot be honestly marked complete from GitHub-only edits without building and listening on Android/iOS. Do not enable or label REELSONIC as active until this validation passes.
