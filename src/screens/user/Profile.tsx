import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { CircleUserRound } from "lucide-react-native";
import type { RootStackParamList } from "../../types/rootStackParamList";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";

export function UserProfile() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState, onLogout } = useAuth();
  const [userName, setUserName] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const myUser = async () => {
    try {
      const token = authState?.token
      
      const result = await Axios.get(`/user`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(result.data);
      
      const username = result.data.user.name;
      setUserName(username)
    } catch (e: any) {
      console.warn("Erro ao buscar usuário:", e?.response?.data?.msg || e.message);
    } finally {
      setLoading(false);
    }
  };

  const [favoritos] = useState([
    {
      id: 1,
      titulo: "Imagem 1",
      acao: "Remoção de fundo",
      data: "08/04/2025",
      hora: "10:24",
    },
    {
      id: 2,
      titulo: "Imagem 2",
      acao: "Rotacionar",
      data: "08/04/2025",
      hora: "10:24",
    },
  ]);

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      <View style={tw`flex-1 p-5`}>

        {/* Cabeçalho */}
        <TouchableOpacity 
        onPress={() => navigation.goBack()}
        accessibilityLabel="Voltar"
        style={tw`mb-6 justify-content items-center gap-2 left-1.5 flex-row`}>
          <AntDesign name="left" size={24} color="#fff" />
          <Text style={tw`text-white text-lg font-bold`}>Perfil de Usuário</Text>
        </TouchableOpacity>

        {/* Info Usuário */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`w-12 h-12 rounded-full bg-white mr-3 items-center justify-center`}>
            <CircleUserRound color="#334155" size={45} />
          </View>
          <View>
            <Text style={tw`text-white text-base font-semibold`}>{userName}</Text>
            <Text style={tw`text-slate-400 text-sm`}>Usuário ativo</Text>
          </View>
        </View>

        {/* Lista de Favoritos */}
        <Text style={tw`text-white text-2xl font-bold mb-3`}>Favoritos</Text>
        <ScrollView contentContainerStyle={tw`pb-24`}>
          {favoritos.map((item) => (
            <View
              key={item.id}
              style={tw`flex-row justify-between items-center py-3 border-b border-slate-700`}
            >
              <View>
                <Text style={tw`text-white text-xl font-semibold`}>{item.titulo}</Text>
                <Text style={tw`text-slate-400 text-xs`}>{item.acao}</Text>
              </View>
              <View>
                <Text style={tw`text-slate-400 text-xs text-right`}>{item.data}</Text>
                <Text style={tw`text-slate-400 text-xs text-right`}>{item.hora}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Botões */}
        <View style={tw`absolute bottom-5 left-5 right-5 gap-4`}>
          <TouchableOpacity
          onPress={() => navigation.navigate("Favoritos")}
          style={tw`bg-slate-800 p-3 rounded-lg items-center`}>
            <Text style={tw`text-white text-base`}>Ver todos os favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`bg-slate-800 p-3 rounded-lg items-center`}>
            <Text style={tw`text-white text-base`}>Ver histórico</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
