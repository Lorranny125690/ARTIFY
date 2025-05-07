import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";
import { RootNavigator } from "./navigation/AppNavigation";
import { UserProvider } from "./screens/user";
import { AuthProvider } from "./scripts/AuthContext/authenticatedUser";

export function App() {
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
    backgroundColor: "#121212"
  },
});
