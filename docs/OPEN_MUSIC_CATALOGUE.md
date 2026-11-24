# RHYTHM E — Open Music Catalogue

## Product direction

The development branch uses open and creator-published sources. It does not promise access to every commercial recording.

## Integrated sources

- **Audius:** creator-published tracks searched through the public API and current weekly trending tracks are fetched for the Home discovery feed. Stream availability and usage terms remain subject to the creator and Audius. A public stream is not represented as a blanket copyright licence.
- **Internet Archive:** audio items are searched and their metadata is checked for supported Creative Commons or public-domain licence URLs before a playable file is offered. Metadata is uploader-provided; users should inspect the item page.
- **Wikimedia Commons:** audio files are searched through the Commons API. Results are limited to CC0, CC BY, CC BY-SA and public-domain labels, with a link to the file description and attribution metadata.

The Home feed can blend the current Audius weekly trending list with the listener's recent/favourite artist affinity. This is a lightweight on-device ranking signal, not a machine-learning model or a claim to know a listener's full taste. Each source is queried independently. If one source is unavailable, results from the other successful sources can still be returned. Playback uses the existing shared Expo Audio player and queue.

## Attribution and rights

Every result links to its source page. Licence labels are informative metadata, not a substitute for checking the specific item page, creator attribution requirements, territory restrictions or platform terms. Do not strip attribution or re-host/cache media without permission.

## Why NewPipeExtractor is not integrated

The supplied NewPipeExtractor source describes itself as a library for extracting content from streaming sites, including YouTube and SoundCloud, and is licensed under GPL-3.0-or-later. It is not an open-music catalogue or a music-rights provider. RHYTHM E therefore does not use it to resolve third-party streams. The current open-catalogue adapters use documented public catalogue APIs and source-provided audio URLs instead.

If the project later distributes a derivative work containing GPL-3.0 code, its distribution and corresponding-source obligations must be reviewed and satisfied. Adding the extractor would not grant rights to copyrighted music or override any provider's terms.

## Validation still required

- Run `npm install` and `npm run typecheck` locally.
- Run `npx expo-doctor`.
- Test searches for each source on Android, including empty results and individual source outages.
- Test actual playback, seek, next-track, background playback and lock-screen controls on a native build.
- Verify attribution links and licence metadata for representative results from Internet Archive and Wikimedia Commons.
- Do not claim broad catalogue coverage or production readiness until these checks pass.
