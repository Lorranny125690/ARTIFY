import React, { useState } from "react";
import { 
  View, Text, Image, TouchableOpacity, Modal, ScrollView, Alert, Platform 
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";

const initialImages = Array(10).fill(require("../assets/nerd.jpg"));

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Auth: undefined;
  SaveImages: undefined;
  Gallery: undefined;
};

export function ImageGallery() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState(initialImages);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageDelete = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = images.filter((_, i) => i !== selectedImageIndex);
      setImages(updatedImages);
      setModalVisible(false);
    }
  };

  const handleImageSave = async () => {
    if (selectedImageIndex !== null) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Você precisa permitir acesso à galeria para salvar imagens.");
        return;
      }
  
      try {
        const asset = Asset.fromModule(images[selectedImageIndex]);
        await asset.downloadAsync(); // Faz o download se necessário
  
        const fileUri = asset.localUri;
  
        if (fileUri) {
          await MediaLibrary.saveToLibraryAsync(fileUri);
          Alert.alert("Sucesso", "Imagem salva na galeria!");
        } else {
          throw new Error("URI local não disponível.");
        }
      } catch (error) {
        console.error("Erro ao salvar imagem:", error);
        Alert.alert("Erro", "Não foi possível salvar a imagem.");
      }
  
      setModalVisible(false);
    }
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
        <View style={tw`flex-row items-center`}>
          <Image source={require("../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Galeria */}
      <ScrollView>
        <View style={tw`flex-row flex-wrap justify-between px-2`}>
          {images.map((src, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(index)}>
              <Image 
                source={src} 
                style={tw`w-40 h-40 rounded-lg m-2`} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
                source={images[selectedImageIndex]} 
                style={tw`w-full h-40 rounded-lg mb-4`} 
                resizeMode="cover"
              />

              <Text style={tw`text-xl text-white mb-4 text-center`}>O que você deseja fazer?</Text>
              
              <View style={tw`flex-row justify-around`}>
                <TouchableOpacity onPress={handleImageEdit} style={tw`items-center`}>
                  <Icon name="edit" size={28} color="#60A5FA" />
                  <Text style={tw`text-white text-xs mt-1`}>Editar</Text>
                </TouchableOpacity>

                {/* gitando */}
                <TouchableOpacity onPress={handleImageDelete} style={tw`items-center`}>
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
