import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { API_URL, useAuth } from "../../contexts/AuthContext/authenticatedUser";
import type { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";

export function ImageGallery() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<{ id: string, uri: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authState } = useAuth();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = authState?.token;
      const result = await Axios.get("/images", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Imagens recebidas:", result.data);
      
      const imageList = result.data.images;
      setImages(imageList);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.msg || e.message);
      Alert.alert("Erro", "Não foi possível carregar as imagens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDeleteImage = async () => {
    if (selectedImageIndex === null) return;
  
    const imageId = images[selectedImageIndex].id;
    try {
      const token = authState?.token;
      const result = await Axios.delete(`/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (result.status === 200) {
        alert("Deletado com sucesso!");
        fetchImages();
      }
    } catch (error: any) {
      console.warn("Erro ao deletar a imagem:", error?.response?.data?.msg || error.message);
      Alert.alert("Erro", "Não foi possível excluir a imagem.");
    }
  };
    

  const handleImageSave = async () => {
    if (selectedImageIndex === null) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Você precisa permitir acesso à galeria.");
      return;
    }

    try {
      const uri = images[selectedImageIndex].uri;
      const filename = uri.split("/").pop() || `image_${Date.now()}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;
      const downloadResult = await FileSystem.downloadAsync(uri, fileUri);

      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      Alert.alert("Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      Alert.alert("Erro", "Não foi possível salvar a imagem.");
    }

    setModalVisible(false);
  };

  const handleImageEdit = () => {
    if (selectedImageIndex !== null) {
      console.log("Editar imagem com índice:", selectedImageIndex);
      setModalVisible(false);
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Carregando */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={tw`text-white mt-2`}>Carregando imagens...</Text>
        </View>
      ) : images.length === 0 ? (
        <Text style={tw`text-white text-center mt-4`}>Nenhuma imagem encontrada.</Text>
      ) : (
        <ScrollView>
          <View style={tw`flex-row flex-wrap justify-between px-2`}>
            {images.map((image, index) => {
              const safeUri = encodeURI(image.uri);
              return (
                <TouchableOpacity key={index} onPress={() => openModal(index)}>
                  <Image 
                    source={{ uri: safeUri }} 
                    style={tw`w-40 h-40 rounded-lg m-2 border border-red-500`}
                    onError={(e) =>
                      console.warn("Erro ao carregar imagem:", e.nativeEvent.error, "URI:", safeUri)
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Modal */}
      {selectedImageIndex !== null && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-80`}>
            <View style={tw`bg-slate-800 p-6 rounded-lg w-80`}>
              <Image 
                source={{ uri: encodeURI(images[selectedImageIndex].uri) }} 
                style={tw`w-full h-40 rounded-lg mb-4 border border-red-500`}
                resizeMode="cover"
                onError={(e) =>
                  console.warn("Erro ao carregar imagem no modal:", e.nativeEvent.error)
                }
              />

              <Text style={tw`text-xl text-white mb-4 text-center`}>
                O que você deseja fazer?
              </Text>
              
              <View style={tw`flex-row justify-around`}>
                <TouchableOpacity onPress={handleImageEdit} style={tw`items-center`}>
                  <Icon name="edit" size={28} color="#60A5FA" />
                  <Text style={tw`text-white text-xs mt-1`}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDeleteImage} style={tw`items-center`}>
                  <Icon name="trash" size={28} color="#3B82F6" />
                  <Text style={tw`text-white text-xs mt-1`}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleImageSave} style={tw`items-center`}>
                  <Icon name="save" size={28} color="#2563EB" />
                  <Text style={tw`text-white text-xs mt-1`}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
