import { Stack } from "expo-router";
// import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
  // const { isLoggedIn } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {true ? (
        <>
          <Stack.Screen name="index" /> {/* Home */}
          <Stack.Screen name="courses/index" />
          <Stack.Screen name="profile/index" />
        </>
      ) : (
        <>
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />
        </>
      )}
    </Stack>
  );
}
