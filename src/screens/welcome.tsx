import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "twrnc";
import { RootStackParamList } from "../types/rootStackParamList";

export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={tw`flex-1 bg-slate-900 items-center justify-center`}>
      {/* Imagem do Logo */}
      <View style={tw`mb-20`}>
        <Image 
          source={require("../assets/iconArtify.png")} 
          style={tw`w-80 h-80`} 
          resizeMode="contain"
        />
      </View>

      {/* Botão Cadastrar-se */}
      <TouchableOpacity 
        style={tw`bg-gray-800 py-2 px-10 rounded-lg mb-4 w-4/5 items-center`}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Cadastrar-se</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity 
        style={tw`bg-gray-800 py-2 px-10 rounded-lg mb-4 w-4/5 items-center`}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
