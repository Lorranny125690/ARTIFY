// RootNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStack } from "./Rotas/AuthStack";
import { HomeDrawer } from "./Rotas/HomeDrawer";
import { ImagePreviewScreen } from "../screens/camera";
import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
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
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Home" component={HomeDrawer} />
      <Stack.Screen name="Photo" component={ImagePreviewScreen} />
    </Stack.Navigator>
  );
}
