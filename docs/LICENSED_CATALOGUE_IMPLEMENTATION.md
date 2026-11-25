> **Status note (22 November 2026):** This is an alternative future expansion plan, not the current product direction. The current choice is a free-to-use, non-commercial LastWave-inspired player. See `docs/LASTWAVE_INSPIRED_NONCOMMERCIAL_PLAN.md`. Do not begin commercial catalogue integration unless the owner explicitly changes direction and the required rights and funding are available.

# RHYTHM E — Licensed music catalogue implementation plan

## Product decision

The selected direction is a **licensed, on-demand music streaming catalogue** for RHYTHM E, with India as the first launch territory. The goal is a mainstream catalogue experience (search, artist/album pages, playlists, charts, recommendations and Flow), not an Instagram music-library copy.

This is a planning document only. No catalogue provider, label agreement, API credentials, playback rights or music files have been acquired. Do not show commercial tracks or enable streaming until the required agreements are signed and verified.

## Critical rights distinction

A music API, metadata feed, distributor account or consumer subscription does not automatically grant RHYTHM E the right to stream recordings in its own app.

Before launch, the signed agreement must expressly cover:
- Interactive, on-demand audio streaming inside RHYTHM E
- Master/sound-recording rights and composition/publishing rights, as applicable
- India territory at launch, with any later territories separately cleared
- Mobile apps, web clients (if added), caching/buffering and CDN delivery
- Subscription, ad-supported or other monetisation model
- Reporting, usage accounting, royalty calculation and payment
- Metadata, artist/album artwork, previews and promotional use
- Offline downloads only if explicitly granted, including DRM and expiry rules
- Lyrics only if separately licensed
- Synchronisation rights separately, if users can add songs to videos/reels and export or share them

PPL India's FAQ says it does not issue licences for sound recordings on digital platforms and directs app operators to the individual labels. This is a reminder to negotiate with the actual rights holders or an authorised aggregator; do not assume a public-performance licence is enough.

## Provider / partner evaluation

Treat these as **discovery leads, not approved providers or confirmed offers**:
1. **Direct label agreements** — approach relevant Indian and international labels/rightsholders for an app-specific interactive streaming licence.
2. **7digital** — investigate its B2B music licensing, catalogue coverage, territory rights, playback delivery, minimum guarantees and commercial terms.
3. **Tuned Global** — investigate its streaming-platform technology, catalogue/licensing support, territory coverage and whether its current offer grants the rights RHYTHM E needs.
4. **Other authorised music aggregators** — verify that they can sublicense on-demand consumer streaming rights to a third-party branded app, not merely distribute a label's releases to existing DSPs.

Do not select a provider based only on an API demo or catalogue size. Obtain a written rights schedule and technical specification first.

## Phase 0 — Phone-only preparation (current)

No laptop or local build is required for this phase:
- Keep all changes on `development`; never touch `main`.
- Keep local-file playback working.
- Keep Flow working with user-imported local tracks.
- Do not add scraped streams, unofficial endpoints, ripped audio, or hidden web-player URLs.
- Do not add API keys or provider secrets to the React Native app.
- Prepare provider questions and a rights checklist before requesting commercial access.

## Phase 1 — Partner and rights validation

Before coding a provider-specific integration:
1. Request an app/platform licence proposal and catalogue sample for India.
2. Confirm on-demand streaming rights for a third-party mobile app under RHYTHM E's own brand.
3. Confirm the catalogue's Hindi, Bollywood, Punjabi, Odia and other regional coverage; do not assume every label or track is included.
4. Confirm territory restrictions, subscription/ad-supported permissions, minimum guarantees, per-stream royalties, reporting and payment terms.
5. Confirm audio delivery method, codecs/bitrates, DRM, token expiry, playback concurrency and offline rules.
6. Confirm metadata/artwork display and attribution requirements.
7. Confirm whether lyrics and social-video synchronisation are included or require separate agreements.
8. Have the final agreement reviewed by qualified Indian IP/media counsel before launch.

**Go/no-go gate:** no signed rights schedule = no commercial catalogue playback.

## Phase 2 — Backend-first architecture

Build the provider integration on the server, not directly in the mobile client.

Suggested modules:
- `src/catalog/types.ts`: provider-neutral track, artist, album, playlist, search and playback types.
- `src/catalog/provider.ts`: provider adapter interface.
- `src/catalog/providers/<provider>/`: one adapter for the selected licensed provider.
- `src/services/catalog-api.ts`: authenticated app-facing API client.
- Backend service (to be designed after provider selection): stores provider credentials, validates user entitlement, requests playback authorisation and returns short-lived playback sessions.
- Database: catalogue identifiers, user playlists/favourites, playback history, territory/rights flags and entitlement records; do not mirror/store full copyrighted audio unless the agreement allows it.

Security requirements:
- Provider secrets remain on the backend.
- Mobile app receives only short-lived, scoped playback authorisation or provider-approved playback tokens.
- Enforce territory, subscription entitlement, concurrency and expiry server-side.
- Never expose permanent CDN URLs or private provider credentials in the app bundle.
- Log playback events required by the contract while minimising personal data.

## Phase 3 — App experience

Build in this order after a provider is selected and sandbox access is granted:
1. Search catalogue: tracks, artists, albums and playlists.
2. Track and artist pages with provider-approved metadata/artwork.
3. Licensed playback in the existing player architecture or a validated replacement.
4. Flow feed using authorised catalogue tracks and approved previews/full tracks according to the agreement.
5. Queue, play/pause, seek, next/previous and background playback.
6. User playlists, favourites and listening history.
7. Browse by language, genre, mood and editorial charts.
8. Recommendations after enough legitimate listening data exists.
9. Subscription/payment and entitlement flows only after commercial terms and business model are approved.

Keep local imported music available as a separate library source.

## Phase 4 — Quality, compliance and release

Test:
- Android devices and supported OS versions; then iOS
- Audio focus, Bluetooth, wired headsets, interruptions and background playback
- Slow networks, retries, expired tokens and unavailable territory
- Subscription cancellation, entitlement expiry and concurrent-device rules
- Accurate stream reporting and royalty reconciliation
- Takedown, catalogue removal and rights-expiry propagation
- Privacy, security and account deletion

No production release until legal, reporting, support and payment obligations are operational.

## Cost and business-model questions

Expect commercial licensing to involve negotiated terms. Potential cost elements include minimum guarantees/advances, per-stream royalties or revenue share, platform/technology fees, DRM/CDN costs, reporting and taxes. Do not assume a free public API provides commercial streaming rights.

The business model (subscription, ads, or both) must be compatible with the provider agreement. Avoid promising an unlimited free catalogue until unit economics are known.

## Current project status

- Chosen: licensed on-demand music catalogue.
- Initial territory target: India.
- Provider: not selected; no agreement signed.
- Credentials: none.
- Backend catalogue integration: not implemented.
- Commercial catalogue playback: not implemented.
- Existing local-file playback and Flow remain the available listening path.
- All project work remains on `development`.

## Official / primary research starting points

- PPL India FAQ (digital-platform sound recording licensing): https://www.pplindia.org/faq/get_ppl_license
- 7digital B2B catalogue/licensing should be evaluated directly with its commercial team; request current API, territory and rights documentation.
- Tuned Global platform and licensing should be evaluated directly with its commercial team; request current API, catalogue and territory documentation.

These links are research starting points, not endorsements or proof that any provider will license RHYTHM E.
