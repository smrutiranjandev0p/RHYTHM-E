# Third-party software licences

## NewPipeExtractor

- Project: NewPipeExtractor
- Upstream: https://github.com/TeamNewPipe/NewPipeExtractor
- Version configured for Android: v0.27.1
- Licence: GNU General Public License v3.0 or later (GPL-3.0-or-later)
- JitPack coordinate: `com.github.TeamNewPipe:NewPipeExtractor:v0.27.1`

RHYTHM E's Android prebuild configuration adds this dependency and the JitPack repository. The dependency is not itself a playback provider and does not grant rights to any audio, video, or streaming service content.

### Distribution checklist

Before distributing an Android build containing NewPipeExtractor:

1. Include the complete GPL-3.0-or-later licence text and preserve upstream copyright and licence notices.
2. Provide the corresponding source for the exact NewPipeExtractor version and any modifications, under the GPL terms.
3. Review whether the combined distributed work is a GPL-covered derivative and ensure RHYTHM E's distribution/licensing approach is compatible.
4. Include notices for all transitive dependencies and comply with their separate licences.
5. Do not imply that GPL grants permission to access, reproduce, stream, download, or redistribute third-party music.

The Android Expo module now exposes a read-only React Native bridge for the library version and built-in service capability metadata. It performs no network requests, service searches, stream resolution, media playback, downloading, or sharing. Existing authorised catalogue adapters (Audius, Internet Archive and Wikimedia Commons) continue to supply their own metadata and permitted audio URLs to the existing Expo Audio player. The NewPipe service list is descriptive library metadata, not a declaration that those providers authorize RHYTHM E playback.
