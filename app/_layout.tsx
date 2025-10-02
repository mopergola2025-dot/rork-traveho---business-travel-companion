import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TravelFriendsContext } from "@/contexts/TravelFriendsContext";
import { TripsContext } from "@/contexts/TripsContext";
import { ExpensesContext } from "@/contexts/ExpensesContext";
import { DocumentsContext } from "@/contexts/DocumentsContext";
import { EmergencyContext } from "@/contexts/EmergencyContext";
import AuthScreen from "./auth";
import Colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthComplete={() => {}} />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TravelFriendsContext>
            <TripsContext>
              <ExpensesContext>
                <DocumentsContext>
                  <EmergencyContext>
                    <GestureHandlerRootView style={styles.container}>
                      <StatusBar style="dark" />
                      <RootLayoutNav />
                    </GestureHandlerRootView>
                  </EmergencyContext>
                </DocumentsContext>
              </ExpensesContext>
            </TripsContext>
          </TravelFriendsContext>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
