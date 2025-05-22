import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Sidebar } from "../../components/sidebar";
import { HomeScreen } from "../../screens/Home";
import { Ferramentas } from "../../screens/tools/Ferramentas";
import { UserProfile } from "../../screens/user/Profile"
import { ImageGallery } from "../../screens/images/MinhasIMagens";

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
      <Drawer.Screen name="Profile" component={UserProfile}/>
    </Drawer.Navigator>
  );
}
