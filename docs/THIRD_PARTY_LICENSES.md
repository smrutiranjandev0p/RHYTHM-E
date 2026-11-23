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

The repository currently configures the Android dependency only. No NewPipeExtractor service extraction, stream resolution, or React Native playback bridge is enabled by this change. Existing authorised catalogue adapters and the existing audio player remain the playback path.
