import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Sidebar } from "../../components/sidebar";
import { HomeScreen } from "../../screens/Home";
import { ImageGallery } from "../../screens/banco";
import { Ferramentas } from "../../screens/ferramentas";

const Drawer = createDrawerNavigator();

export function HomeDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="SaveImages" component={ImageGallery} />
      <Drawer.Screen name="Ferramentas" component={Ferramentas} />
    </Drawer.Navigator>
  );
}
