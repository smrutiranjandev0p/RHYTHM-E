# RHYTHM E — LastWave-inspired, non-commercial plan

## Product decision

The current direction is a **free-to-use, non-commercial music player and discovery client for personal, educational and research use**, inspired by the feature set described by LastWave. It is not a promise of a free, unrestricted commercial music catalogue.

The owner currently has an Android phone and no laptop. This document is planning work only; no native build or device validation is claimed.

## Reference project and licence

Reference: https://github.com/Clash-Projects/LastWave-native

The repository currently contains:
- A `LICENSE` file with GNU GPL version 3.
- A README describing LastWave as an open-source, non-commercial application for educational and research purposes.
- An Android-native Kotlin implementation with features including advanced playback, parametric EQ, AutoEQ, ReplayGain/LUFS normalisation, crossfade/Automix, tempo/pitch controls, lyrics and discovery integrations.

Important distinction:
- GPL-3.0 is a software copyright licence, not a music-content licence. It grants rights to use, study, modify and redistribute covered software subject to its conditions.
- GPL-3.0 itself does not prohibit commercial use. The LastWave README's non-commercial statement is a separate project disclaimer/statement of intent; its legal effect and relationship to GPL-3.0 should be reviewed by qualified counsel.
- If RHYTHM E copies or adapts GPL-3.0-covered LastWave code and distributes a derivative work, GPL-3.0 obligations can apply to the covered work, including providing corresponding source and preserving notices. Do not copy code until the exact files, copyright notices, dependency licences and distribution model have been reviewed.
- This plan prefers an independent RHYTHM E implementation inspired by documented features, not copying LastWave source or assets.

## What "everything free" can realistically mean

RHYTHM E can aim for:
- No paid subscription required to use the app.
- No paid proprietary DSP library; use platform APIs and compatible open-source components.
- No paid backend while the app is personal/local-only; avoid a hosted service until one is necessary.
- Local playback of audio files the user owns or is authorised to play.
- Optional public-domain or Creative Commons music only where the specific track's licence permits the intended use; retain attribution and comply with licence conditions.
- Open-source lyrics/metadata tools only within their API terms, rate limits and content rights.

It cannot honestly promise:
- Every commercial song for free.
- Unlimited YouTube Music or Spotify playback through unofficial endpoints.
- Free rights to download, cache, redistribute or stream copyrighted tracks.
- Free cloud sync, CDN bandwidth, DRM, label catalogues or commercial licensing.

Non-commercial intent does not itself grant rights to copyrighted music or override platform terms.

## Feature plan inspired by LastWave

### A. Playback foundation
- Keep RHYTHM E's current Expo Audio local-file playback until a replacement is proven.
- Queue, play/pause, seek, previous/next, background playback and lock-screen controls.
- Persistent local library and playlists, subject to Android/iOS storage permissions.
- Sleep timer, skip silence and gapless playback where supported.
- Preserve a true original/bypass playback path.

### B. Audio Lab / REELSONIC
- 10/15-band parametric EQ with frequency, gain and Q controls.
- Device/output-aware presets and safe reset.
- Bass enhancement only when a real native effect is available.
- ReplayGain-style track/album loudness handling where metadata exists.
- AutoEQ headphone profiles only from a source with a compatible licence.
- Tempo and pitch controls if the selected engine supports them.
- Crossfade/Automix only after gapless transition tests.
- USB DAC / exclusive output only on supported Android hardware and after native validation.
- Never label a control active until it changes the actual audio signal.

### C. Lyrics
- Timestamped lyrics from a source whose API and lyric-content terms permit the use.
- Clear attribution and a fallback when lyrics are unavailable.
- Translation/romanisation only where source terms permit it.
- Do not scrape or republish lyrics without rights.

### D. Discovery and integrations
- Search local tracks and metadata first.
- Public-domain/Creative Commons catalogue integrations only after verifying track-level licences.
- Optional Spotify integration may be limited to authorised account features, metadata, playlist references or deep links as permitted by Spotify's current developer terms; do not use it as a way to extract or relay Spotify audio.
- Do not assume YouTube Music public endpoints grant permission to resolve, download, cache or relay music streams. Do not implement access-control circumvention, private API scraping, or stream ripping.
- Any third-party provider must be reviewed for API terms, content rights, rate limits and attribution before activation.

### E. Visual and social features
- Material You-inspired colour system, dark/AMOLED themes and expressive motion.
- Dynamic artwork backgrounds using artwork the app is authorised to display.
- Shareable lyric cards only when lyric and artwork rights permit.
- Listen-together and cloud sync are later features because they require a backend, operational costs and privacy/security work.

## Suggested architecture for RHYTHM E

RHYTHM E currently uses Expo Router / React Native and Expo Audio, while LastWave is a native Android Kotlin app. Reuse product concepts, not Android-specific implementation assumptions.

- `src/audio`: playback abstraction, queue and engine adapters.
- `src/audio/dsp`: EQ/preset model and DSP adapter interfaces.
- `src/library`: local file indexing, metadata, playlists and favourites.
- `src/lyrics`: provider adapter, timestamp parser and attribution.
- `src/catalog`: metadata/catalogue adapters with explicit source and licence metadata.
- `src/settings`: output route, audio profile, privacy and theme settings.

Keep the current player intact until a candidate audio engine proves:
1. Android local-file playback.
2. Queue, seeking, track completion and interruptions.
3. Background playback and lock-screen/media controls.
4. Actual EQ/DSP processing with a true bypass.
5. No regression on the physical Android device.

## Phased delivery

1. **Phone-only preparation:** document architecture, feature scope, source/licence audit and acceptance tests. No APK build can be done from the current phone-only setup.
2. **Laptop available:** clone the RHYTHM E `development` branch, run dependency/type checks and create a development build.
3. **Audio engine proof of concept:** evaluate a maintained native audio graph and verify local playback before migration.
4. **REELSONIC DSP:** implement EQ, presets, safe gain staging, bypass and physical-device tests.
5. **Library and lyrics:** add persistent local library and authorised lyric source integration.
6. **Free catalogue discovery:** add only public-domain/Creative Commons tracks with verified track-level permissions and required attribution.
7. **Optional online services:** evaluate each integration separately; free tier availability and terms may change.

## Non-negotiable project rules

- Keep all changes on RHYTHM E's `development` branch; do not touch `main`.
- Do not copy LastWave code/assets until the GPL-3.0 and all dependency licences have been reviewed.
- If a GPL-3.0 derivative is distributed, comply with GPL-3.0 source, notice and licensing requirements.
- No commercial music streaming, downloads or caching without the appropriate rights.
- No unofficial stream ripping, private API scraping or access-control circumvention.
- Never embed provider secrets in the app.
- Do not claim features work until the complete playback path is implemented and tested.
- Be transparent that "free app" does not mean "all copyrighted music free".

## Current status

- Product direction selected: non-commercial, free-to-use, LastWave-inspired player.
- Reference project: LastWave-Native (Kotlin Android, GPL-3.0 file, README non-commercial educational/research statement).
- RHYTHM E remains its own Expo / React Native project.
- No LastWave source code or assets have been copied as part of this plan.
- Existing RHYTHM E local-file playback and Flow remain the working intended sources until native builds are tested.
- No unrestricted commercial catalogue, stream extraction, cloud backend or active REELSONIC DSP has been implemented.


## Implementation update — November 2026

The RHYTHM E `development` branch now has a first permitted free-source path:
- Internet Archive Advanced Search discovers audio items, then item metadata is fetched and filtered to Creative Commons Attribution / Attribution-ShareAlike / Attribution-NonCommercial / Attribution-NonCommercial-ShareAlike and Public Domain Mark/Zero licence URL patterns.
- Playback uses the existing Expo Audio player and shared queue; each result exposes its source item and declared licence for review.
- LRCLIB provides lyrics lookup and timestamped line highlighting when synced lyrics are returned.
- YouTube search is handed off to the official YouTube app/site. This is deliberately not stream extraction or in-app audio relaying.
- Flow favourites are shared with Library in the current session.

Caveats: Internet Archive metadata is supplied by uploaders and is not an independent rights audit; users must review each item's source page and licence. Persistent playlists/favourites, a native YouTube player, active REELSONIC DSP, and verified background playback are still pending. No typecheck, native build, or physical-device test was performed during this update.
