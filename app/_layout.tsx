import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AudioProvider } from "../src/audio/AudioProvider";
import { SettingsProvider } from "../src/settings/SettingsProvider";

export default function RootLayout() {
  return (
    <SettingsProvider>
    <AudioProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#160D1C" } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" options={{ presentation: "card", animation: "slide_from_right" }} />
        <Stack.Screen name="player/[id]" options={{ presentation: "card", animation: "slide_from_bottom" }} />
        <Stack.Screen name="lyrics/[id]" options={{ presentation: "card", animation: "slide_from_bottom" }} />
        <Stack.Screen name="sound-lab" options={{ presentation: "card", animation: "slide_from_right" }} />
        <Stack.Screen name="settings" options={{ presentation: "card", animation: "slide_from_right" }} />
        <Stack.Screen name="insights" options={{ presentation: "card", animation: "slide_from_right" }} />
      </Stack>
    </AudioProvider>
    </SettingsProvider>
  );
}
