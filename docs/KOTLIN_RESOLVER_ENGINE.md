# RHYTHM E Kotlin Resolver Engine

## Scope

This is an isolated native Kotlin resolver core behind the existing Expo module. It does not change React Native screens, navigation, the current Expo Audio player, or the app's visual design.

## Architecture

```
React Native UI (unchanged)
        |
Existing Expo native-module boundary
        |
ResolverRegistry
        |
StreamResolveCoordinator
  |       |        |
dedupe   cache   prefetch cancellation
        |
Provider adapters (to be registered)
        |
Existing playback handoff (not wired yet)
```

## Implemented in this branch

- Normalized `ResolvedMedia` model.
- Provider-neutral `MediaResolver` contract.
- Ordered `ResolverRegistry` for primary/fallback adapters.
- `StreamResolveCoordinator` with concurrent-request sharing, bounded in-memory cache, expiry checks and cancellable prefetch.
- Typed resolver failures.
- TypeScript metadata method to inspect the native engine capability state.

## Not yet implemented

- No InnerTubeX adapter is registered.
- No NewPipe network downloader or service resolver is registered.
- No YouTube stream resolution is enabled.
- No playback URL is passed into Expo Audio or Media3.
- No UI or navigation changes have been made.

These are explicit integration gates, not working features. The coordinator is a foundation and must not be presented as a finished music-streaming engine.

## Security and caching

Playback URLs may be signed and short-lived. The initial cache is memory-only; it does not persist signed URLs to disk or log them. Provider adapters must validate HTTPS destinations, respect provider authorization and return an expiry time whenever known.

## Licensing

NewPipeExtractor is GPL-3.0-or-later. Preserve upstream notices and include the corresponding source/licence materials required for distributed builds. This document and the original RHYTHM E resolver-core classes are independently written; no LastWave source files were copied into this module.
