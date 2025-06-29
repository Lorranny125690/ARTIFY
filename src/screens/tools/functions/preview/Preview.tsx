import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
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

const screenHeight = Dimensions.get("window").height;

export const ImagePreviewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState } = useAuth();
  const { images } = useImagesContext();
  const route = useRoute();
  const { imageId, imageUri } = route.params as { imageId?: string; imageUri?: string };

  const image = imageId
    ? images.find((img) => img.id === imageId)
    : imageUri
    ? { uri: imageUri, id: "processed" }
    : undefined;

  if (!image || !image.uri) {
    return (
      <SafeAreaView style={tw`flex-1 bg-slate-900 justify-center items-center`}>
        <Text style={tw`text-white text-base`}>Imagem não encontrada ou inválida.</Text>
      </SafeAreaView>
    );
  }

  const handleDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Você precisa permitir acesso à galeria para salvar imagens.");
      return;
    }

    try {
      const fileName = image.uri.split("/").pop() || `imagem_${Date.now()}.jpg`;
      const destPath = `${FileSystem.cacheDirectory}${fileName}`;

      // Faz o download direto da URL
      const downloadResumable = FileSystem.createDownloadResumable(image.uri, destPath);
      await downloadResumable.downloadAsync();

      await MediaLibrary.saveToLibraryAsync(destPath);
      Alert.alert("Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      Alert.alert("Erro", "Não foi possível salvar a imagem.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      <View style={tw`flex-row items-center justify-between px-5 py-4 bg-slate-800 shadow-lg`}>
        <Text style={tw`text-white text-xl font-bold`}>🔍  Pré-visualização</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="times" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`flex-grow px-5 py-6 items-center justify-center`}>
        <View style={tw`w-full rounded-3xl overflow-hidden shadow-xl mb-6`}>
          <Image
            source={{ uri: image.uri }}
            style={[tw`w-full rounded-3xl`, { height: screenHeight * 0.6 }]}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          onPress={handleDownload}
          style={tw`flex-row items-center justify-center bg-sky-600 py-3 px-6 rounded-full mb-4 shadow-md`}
        >
          <Icon name="download" size={18} color="#fff" style={tw`mr-2`} />
          <Text style={tw`text-white text-base font-semibold`}>
            Baixar para Galeria
          </Text>
        </TouchableOpacity>

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
