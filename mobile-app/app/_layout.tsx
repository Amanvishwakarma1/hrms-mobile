import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
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
}