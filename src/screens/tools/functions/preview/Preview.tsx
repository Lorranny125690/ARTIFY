import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../../../contexts/AuthContext/authenticatedUser";
import { RootStackParamList } from "../../../../types/rootStackParamList";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useImagesContext } from "../../../../contexts/ImageContext/imageContext";
import { Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;

export const ImagePreviewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState } = useAuth();
  const route = useRoute();
  const { imageId } = route.params as { imageId: string };

  const { images } = useImagesContext();
  const image = images.find((img) => img.id === imageId);

  if (!image) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-900 justify-center items-center`}>
        <Text style={tw`text-white text-base`}>Imagem não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const handleDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Você precisa permitir acesso à galeria para salvar imagens."
      );
      return;
    }

    try {
      const fileName = image.uri?.split("/").pop() || `imagem_${Date.now()}.jpg`;
      const destPath = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: image.uri,
        to: destPath,
      });

      await MediaLibrary.saveToLibraryAsync(destPath);
      Alert.alert("Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      Alert.alert("Erro", "Não foi possível salvar a imagem.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      {/* Header bonito */}
      <View style={tw`flex-row items-center justify-between px-5 py-4 bg-slate-800 shadow-lg`}>
        <Text style={tw`text-white text-xl font-bold`}>🔍  Pré-visualização</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="times" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Imagem centralizada */}
      <ScrollView contentContainerStyle={tw`flex-grow px-5 py-6 items-center justify-center`}>
        <View style={tw`w-full rounded-3xl overflow-hidden shadow-xl mb-6`}>
        <Image
          source={{ uri: image.uri }}
          style={[tw`w-full rounded-3xl`, { height: screenHeight * 0.6 }]}
          resizeMode="cover"
        />
        </View>

        {/* Botão de download */}
        <TouchableOpacity
          onPress={handleDownload}
          style={tw`flex-row items-center justify-center bg-sky-600 py-3 px-6 rounded-full mb-4 shadow-md`}
        >
          <Icon name="download" size={18} color="#fff" style={tw`mr-2`} />
          <Text style={tw`text-white text-base font-semibold`}>
            Baixar para Galeria
          </Text>
        </TouchableOpacity>

        {/* Botão de cancelar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`flex-row items-center justify-center py-3`}
        >
          <Icon name="arrow-left" size={18} color="#f87171" style={tw`mr-2`} />
          <Text style={tw`text-red-400 font-semibold text-base`}>
            Cancelar e Voltar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
