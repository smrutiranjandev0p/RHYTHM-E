# RHYTHM E Kotlin Resolver Engine

## Scope

This is an isolated native Kotlin resolver subsystem behind the existing Expo module. React Native screens, navigation and the existing Expo Audio player are retained.

## Architecture

```
React Native UI (unchanged)
        |
Existing AudioProvider / Expo Audio
        |
Native Expo module boundary
        |
ResolverRegistry
        |
StreamResolveCoordinator
  |       |        |
dedupe   cache   prefetch cancellation
        |
AuthorisedCatalogueResolver
        |
HTTPS URL validation for Audius, Internet Archive,
and Wikimedia Commons catalogue URLs
        |
Existing Expo Audio playback handoff
```

## Implemented

- Normalized `ResolvedMedia` model and `MediaResolver` contract.
- Ordered `ResolverRegistry` for primary/fallback adapters.
- `StreamResolveCoordinator` with concurrent-request sharing, bounded in-memory cache, expiry checks and cancellable prefetch.
- `AuthorisedCatalogueResolver` validating HTTPS URLs for RHYTHM E's existing Audius, Internet Archive and Wikimedia Commons catalogue hosts.
- Native capability and URL-validation functions exposed through the existing Expo module.
- Existing Expo Audio remains the playback engine; no player or UI replacement.

## Not implemented

- No InnerTubeX YouTube adapter.
- No NewPipe YouTube stream-extraction fallback.
- No YouTube resolution or playback is enabled.
- The coordinator is not yet wired to every search/feed call site; existing catalogue results continue to use the existing player flow.
- No Android Gradle build or physical-device test has been completed for this feature branch.

## Security

The URL validator permits HTTPS only, restricts hosts to known catalogue domains, rejects user-info and nonstandard ports, and does not log URLs. It is a validation boundary, not proof of copyright permission. Provider adapters must respect the provider's authorization and terms. Signed URLs should be treated as secrets and cached only in memory until expiry.

## Licensing

NewPipeExtractor is GPL-3.0-or-later. Preserve upstream notices and include the corresponding source/licence materials required for distributed builds. The RHYTHM E resolver-core and catalogue URL validator in this branch are independently written; no LastWave source files were copied.
