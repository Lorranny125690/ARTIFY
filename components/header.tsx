import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { Menu } from "lucide-react-native";
import tw from "twrnc";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Auth: undefined;
  SaveImages: undefined;
};

export default function CustomHeader() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`bg-slate-800 flex-row justify-between items-center py-2 px-4`}> 
      <View style={tw`flex-row items-center`}> 
        <Image 
          source={require("../assets/Imagem_do_WhatsApp_de_2025-04-01_à_s__19.57.44_87ca3b52-removebg-preview (1).png")}
          style={tw`w-15 h-15 mr-2`} 
        />
      </View>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> 
        <Menu color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}
