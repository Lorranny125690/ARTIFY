// RootNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomeScreen } from "../screens/welcome";
import { AuthStack } from "./Rotas/AuthStack";
import { HomeDrawer } from "./Rotas/HomeDrawer";
import { ImagePreviewScreen } from "../screens/tools/functions/Preview";
import type { RootStackParamList } from "../types/rootStackParamList";
import { useAuth } from "../scripts/AuthContext/authenticatedUser";

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { authState, onLogout } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        }),
      }}
    >
      {authState?.authenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeDrawer} />
          <Stack.Screen name="Photo" component={ImagePreviewScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}