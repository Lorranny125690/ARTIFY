import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { CircleUserRound } from "lucide-react-native";
import type { RootStackParamList } from "../../types/rootStackParamList";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";
import { MotiView, MotiText } from "moti";

export type ImageType = {
  type: number;
  id: string;
  filename: string;
  dataFormatada: string;
  nome: string;
};

export function UserProfile() {
  const [images, setImages] = useState<ImageType[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState, onLogout } = useAuth();
  const [userName, setUserName] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = authState?.token;

      const result = await Axios.get("/images", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allImages = result.data.simplified || [];

      const imageProcessed = allImages.filter((img: any) => Number(img.type) === 1);

      const imagesWithUrls: ImageType[] = imageProcessed.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");
        const agora = new Date()

        return {
          id: img.id,
          filename: img.filename,
          nome: `${agora.getFullYear()}-${agora.getMonth()+1}-${agora.getDate()}_${agora.getHours()}-${agora.getMinutes()}-${agora.getSeconds()}`,        
          dataFormatada,
          type: img.type
        };
      });

      setImages(imagesWithUrls);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.msg || e.message);
      Alert.alert("Erro", "Não foi possível carregar as imagens.");
    } finally {
      setLoading(false);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      if (authState?.authenticated) {
        myUser();
        fetchImages();
      }
    }, [authState])
  );

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
        <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={tw`mb-6 justify-content items-center gap-2 left-1.5 flex-row`}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Choice")} style={tw`flex-row items-center mb-6`}>
          <View style={tw`w-12 h-12 rounded-full bg-white mr-3 items-center justify-center`}>
            <CircleUserRound color="#334155" size={45} />
          </View>
          <View>
            <Text style={tw`text-white text-base font-semibold`}>
              {userName != undefined ? userName : "Carregando..."}
            </Text>
            <Text style={tw`text-slate-400 text-sm`}>Usuário ativo</Text>
          </View>
          </TouchableOpacity>
        </MotiView>

          {/* Lista de Favoritos */}
        <Text style={tw`text-white text-2xl font-bold mb-3`}>Historico</Text>
        <ScrollView contentContainerStyle={tw`pb-24`}>
          {images.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100, type: 'timing', duration: 400 }}
              style={tw`flex-row justify-between items-center py-3 border-b border-slate-700`}
            >
              <View>
                <Text style={tw`text-white text-xl font-semibold`}>{item.nome}</Text>
                <Text style={tw`text-slate-400 text-xs`}>{item.filename}</Text>
              </View>
              <View>
                <Text style={tw`text-slate-400 text-xs text-right`}>{item.dataFormatada}</Text>
              </View>
            </MotiView>
          ))}
        </ScrollView>

        {/* Botões */}
        <View style={tw`absolute bottom-5 left-5 right-5 gap-4`}>
          <TouchableOpacity
          onPress={() => navigation.navigate("Favoritos")}
          style={tw`bg-slate-800 p-3 rounded-lg items-center`}>
            <Text style={tw`text-white text-base`}>Ver todos os favoritos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
