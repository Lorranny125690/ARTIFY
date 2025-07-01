import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";
import { RootNavigator } from "./navigation/AppNavigation";
import { AuthProvider } from "./contexts/AuthContext/authenticatedUser";
import * as NavigationBar from "expo-navigation-bar";

export function App() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('visible');
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
          <RootNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
