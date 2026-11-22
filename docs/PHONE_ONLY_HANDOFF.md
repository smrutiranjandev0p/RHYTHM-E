# RHYTHM E — Phone-only handoff

This checklist is for continuing development when the owner currently has an Android phone but no laptop.

## What to do right now

- No code changes or app installation are required from the phone.
- Keep all active development on the `development` branch.
- Do not merge into or modify `main`.
- Do not treat the REELSONIC preset screen as active DSP. It is a visual preview only.
- Do not delete or replace the existing Expo Audio playback service before a native-engine migration has passed tests.

## When a laptop becomes available

### 1. Prepare the environment

Install:
- Node.js 22.13 or newer
- Git
- Android Studio and Android SDK (for local Android builds)
- A compatible Java Development Kit as required by the installed Android Gradle tooling

Clone and switch to the correct branch:

```bash
git clone https://github.com/smrutiranjandev0p/RHYTHM-E.git
cd RHYTHM-E
git checkout development
git pull origin development
```

Confirm the branch before editing:

```bash
git branch --show-current
```

Expected output: `development`.

### 2. Install and inspect

```bash
npm install
npx expo install --fix
npx expo-doctor
npm run typecheck
```

Resolve reported errors before attempting an Android build. Do not assume these checks passed until their actual output has been reviewed.

### 3. Establish a playback baseline

Before changing the playback engine, create a development build and verify:
- Import and play a user-owned local audio file
- Play/pause, seek, previous and next
- Track completion and automatic next track
- Background playback and lock-screen controls
- Audio focus/interruption behaviour
- Playback after navigating between Home, Flow, Library and the player

Record the device model, Android version and test results.

### 4. REELSONIC integration gate

Read `docs/REELSONIC_DSP.md` and inspect the current official React Native Audio API documentation before adding the dependency. Build a small proof of concept first. Do not replace the current player until the proof of concept demonstrates local-file playback, a real five-band EQ graph and a genuine bypass path.

Then validate:
- Processed and bypassed playback at matched perceived loudness
- No clipping or harsh distortion at normal and high source levels
- No interruption to queue, seek, background playback or lock-screen controls
- Speaker, wired headset and Bluetooth output routes

If a control is not supported by a device or output route, report it honestly in the UI.

## Safety rules for this project

- Work only on `development`; keep `main` untouched unless explicitly authorized.
- Fetch the latest file and SHA before every GitHub file update.
- Do not claim a build, typecheck, or device test passed unless it was actually run.
- Keep the original audio bypass available.
- Do not add music, lyrics or artwork without appropriate rights.
