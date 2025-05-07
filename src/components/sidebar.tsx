import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useAuth } from "../scripts/AuthContext/authenticatedUser";
import { useEffect, useState } from "react";
import Axios from "../scripts/axios";

export const Sidebar = (props: DrawerContentComponentProps) => {
  const { navigation } = props;
  const { onLogout, UserName } = useAuth();
  
  const [userName, setUserName] = useState<string>("");
  
  useEffect(() => {
    const fetchUser = async () => {
      // Checando se UserName não é undefined
      if (UserName) {
        const name = await UserName();
        if (name) setUserName(name);
      } else {
        console.error("UserName function is not defined.");
      }
    };
  
    fetchUser();
  }, [UserName]);  

  return (
    <View style={tw`flex-1 bg-slate-900 p-4`}>
      {/* Perfil */}
      <View style={tw`flex-row items-center py-4 border-b border-gray-700`}>
        <Icon name="user-circle" size={40} color="white" />
        <Text style={tw`text-white text-lg font-bold ml-3`}>
          {userName || "Carregando..."}
        </Text>
      </View>

      {/* Opções de navegação */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={tw`flex-row items-center py-3`}
      >
        <Icon name="home" size={20} color="#3B82F6" />
        <Text style={tw`text-white text-base ml-3`}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SaveImages")}
        style={tw`flex-row items-center py-3`}
      >
        <Icon name="image" size={20} color="#3B82F6" />
        <Text style={tw`text-white text-base ml-3`}>Minhas Imagens</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Ferramentas")}
        style={tw`flex-row items-center py-3`}
      >
        <Icon name="gavel" size={20} color="#3B82F6" />
        <Text style={tw`text-white text-base ml-3`}>Ferramentas</Text>
      </TouchableOpacity>

      {/* Opções secundárias */}
      <View style={tw`mt-auto`}>
        <TouchableOpacity style={tw`flex-row items-center py-3`}>
          <Icon name="smile-o" size={20} color="#3B82F6" />
          <Text style={tw`text-white text-base ml-3`}>Avaliar aplicativo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row items-center py-3`}>
          <Icon name="share-alt" size={20} color="#3B82F6" />
          <Text style={tw`text-white text-base ml-3`}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center py-3`}
          onPress={onLogout}
        >
          <Icon name="sign-out" size={20} color="#3B82F6" />
          <Text style={tw`text-white text-base ml-3`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
