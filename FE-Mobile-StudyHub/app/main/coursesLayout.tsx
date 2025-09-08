import { Stack } from "expo-router";

export default function CoursesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="../courses/index" />
    </Stack>
  );
}
