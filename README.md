# RHYTHM E 🎧

A cross-platform music app inspired by immersive listening and social discovery, with original branding and design.

## Current status — Milestone 2 (implementation in progress)
- Premium dark home screen
- Six-tab navigation: Home, Discover, Flow, Search, Library and You
- Mood discovery chips and demo track list
- Device audio file import through the system picker
- Shared Expo Audio playback service with background audio and lock-screen configuration
- Local library queue, play/pause, previous/next and 15-second seek controls
- Sound Lab, app settings and listening insights prototype screens
- Full-screen player with native local-file playback controls
- Resso-inspired vertical Flow feed: swipe between local tracks, animated abstract artwork, progress display, favourites and automatic next-track playback
- Persistent mini-player above navigation (hidden in immersive Flow mode)
- Android and iOS app configuration
- Expo SDK 58 / React Native 0.88 project manifest

Local-file playback is now wired through Expo Audio. The app can import audio files selected by the user and play them through the shared player service. Background playback and lock-screen capabilities are configured, but still require a native development build and device testing. The Flow feed currently uses user-imported local audio; it is not an online endless catalogue. Streaming catalogue, EQ/DSP effects, synced lyrics and cloud/social features are not implemented yet.

## Setup when a computer is available
Install Node.js 22.13 or newer, then clone this repository and run:

    npm install
    npx expo install --fix
    npx expo-doctor
    npx expo start

Use Expo Go only if the installed Expo Go app supports SDK 58. For native audio, background playback and production features, create a development build with EAS.

## Roadmap
1. Local device audio access and playback.
2. Background playback, lock-screen controls and queue.
3. Licensed online music catalogue and search.
4. Timed lyrics from an authorised lyrics provider.
5. Accounts, playlists, favourites and cloud sync.
6. QA, EAS builds and Play Store / App Store release.

## Rights
Use only audio and lyrics for which RHYTHM E has the required rights. No Resso branding, proprietary assets or commercial music are bundled here.

## Product roadmap

See [docs/FEATURE_ROADMAP.md](docs/FEATURE_ROADMAP.md) for the planned Resso-inspired listening experience, futuristic audio features, platform architecture, priorities, and licensing considerations.
