// RootNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomeScreen } from "../screens/welcome";
import { AuthStack } from "./Rotas/AuthStack";
import { HomeDrawer } from "./Rotas/HomeDrawer";
import { Favorito } from "../screens/user/Favorites";
import { LastProcess } from "../screens/user/Historico"
import { ImagePreviewScreen } from "../screens/tools/functions/preview/Preview";
import type { RootStackParamList } from "../types/rootStackParamList";
import { useAuth } from "../contexts/AuthContext/authenticatedUser";
import { ImagesProvider } from "../contexts/ImageContext/imageContext";
import { ChangePassword } from "../screens/user/Change";
import { userName } from "../screens/user/UserName"
import { AccountOptions } from "../screens/user/Choice";

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { authState, onLogout } = useAuth();
  
  return (
    <ImagesProvider><Stack.Navigator
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
          <Stack.Screen name="Favoritos" component={Favorito}/>
          <Stack.Screen name="Historico" component={LastProcess}/>
          <Stack.Screen name="Password" component={ChangePassword}/>
          <Stack.Screen name="userName" component={userName}/>
          <Stack.Screen name="Choice" component={AccountOptions}/>
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  </ImagesProvider>
  );
}