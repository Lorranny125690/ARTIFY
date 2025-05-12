import React from "react";
import {
  View, Text, Image, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useImagesServices } from "./Services/MinhasImagens"; // <-- aqui
import type { RootStackParamList } from "../../types/rootStackParamList";
import { CalendarDays, Download, Star, Trash2 } from "lucide-react-native";

export function ImageGallery() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const {
    images,
    loading,
    modalVisible,
    selectedImageIndex,
    openModal,
    handleImageEdit,
    handleDelete,
    handleImageSave,
    setModalVisible,
  } = useImagesServices();

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
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
            {images.map((image, index: any) => (
              <TouchableOpacity key={image.id} onPress={() => openModal(index)}>
                <Image
                  source={{ uri: image.uri }}
                  style={tw`w-40 h-40 rounded-lg m-2 border-2 border-white`}
                  resizeMode="cover"
                  onError={(e) =>
                    console.warn("Erro ao carregar imagem:", e.nativeEvent.error, "URI:", image.uri)
                  }
                />
              </TouchableOpacity>
            ))}
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
      <View style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}>
        <View style={tw`bg-[#1c1c2e] p-4 rounded-2xl w-80 items-center`}>
          <Image
            source={{ uri: images[selectedImageIndex].uri }}
            style={tw`w-64 h-40 rounded-lg mb-4 border border-red-500`}
            resizeMode="contain"
          />

          <Text style={tw`text-white text-lg font-semibold`}>Jinx</Text>
          <View style={tw`flex-row items-center mt-1 mb-3`}>
            <CalendarDays color="white" size={16} />
            <Text style={tw`text-gray-300 ml-2 text-sm`}>08/04/2025</Text>
          </View>

          <View style={tw`flex-row justify-around w-full`}>
            <TouchableOpacity style={tw`flex-row items-center`} onPress={() => {/* delete logic */}}>
              <Trash2 color="red" size={16} />
              <Text style={tw`text-red-500 ml-1`}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`} onPress={() => {/* download logic */}}>
              <Download color="skyblue" size={16} />
              <Text style={tw`text-sky-400 ml-1`}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`} onPress={() => {/* favorite logic */}}>
              <Star color="yellow" size={16} />
              <Text style={tw`text-yellow-400 ml-1`}>Favoritar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>)}
    </View>
  );
}
