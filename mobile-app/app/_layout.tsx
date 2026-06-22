import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
<<<<<<< HEAD
  return <AuthProvider><LayoutContent /></AuthProvider>;
}

function LayoutContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) router.replace("/(auth)/login");
    else if (user && inAuthGroup) router.replace("/(tabs)");
  }, [user, isLoading, segments]);

  return <Slot />;
=======
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="expense-create"
          options={{
            title: 'Add Expense',
            presentation: 'card',
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
>>>>>>> 5c8c823881a39b52032a21db86d03612d6379ba5
}