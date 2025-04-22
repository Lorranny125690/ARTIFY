import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { DrawerContentComponentProps, DrawerNavigationProp } from "@react-navigation/drawer";
import { useUser } from "../screens/user";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/rootStackParamList";

export const Sidebar = (props: DrawerContentComponentProps) => {
  const { navigation } = props;
  const navigator = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-slate-900 p-4`}>
      {/* Perfil */}
      <View style={tw`flex-row items-center py-4 border-b border-gray-700`}>
        <Icon name="user-circle" size={40} color="white" />
        <Text style={tw`text-white text-lg font-bold ml-3`}>
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

        <TouchableOpacity style={tw`flex-row items-center py-3`}
          onPress={() => navigation.navigate("welcome")}>
          <Icon name="sign-out" size={20} color="#3B82F6" />
          <Text style={tw`text-white text-base ml-3`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
