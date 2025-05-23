import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageProps,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../types/rootStackParamList";
import { useFavoritos } from "./Services/Favorites";

function FallbackImage(props: ImageProps) {
  const [error, setError] = useState(false);

  const isRemote = props.source && typeof props.source === "object" && "uri" in props.source;

  return (
    <Image
      {...props}
      source={error || !isRemote ? require("../../assets/images.png") : props.source}
      onError={() => setError(true)}
    />
  );
}

export function Favorito() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const {
    images,
    loading,
    modalVisible,
    selectedImageIndex,
    openModal,
    setModalVisible,
  } = useFavoritos();

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`items-center gap-2 flex-row m-2 py-2 px-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl`}>Favoritos</Text>
      </View>

      <Text style={tw`text-white text-xl mt-6 ml-3 mb-4`}>Imagens Favoritas</Text>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={tw`text-white mt-2`}>Carregando favoritos...</Text>
        </View>
      ) : images.length === 0 ? (
        <Text style={tw`text-white text-center mt-4`}>Nenhuma imagem favoritada.</Text>
      ) : (
        <ScrollView>
          <View style={tw`left-2 flex-row flex-wrap px-2 gap-5`}>
            {images.map((image, index) => (
              <TouchableOpacity
                key={`${image.id}-${index}`} 
                onPress={() => openModal(index)}
              >
                <FallbackImage
                  source={{ uri: image.uri }}
                  style={tw`w-30 h-30 rounded-4`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Modal de visualização */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={tw`flex-1 bg-black/80 justify-center items-center`}>
          {selectedImage && (
            <View style={tw`bg-white rounded-lg p-4 items-center`}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={tw`w-72 h-72 rounded`}
                resizeMode="contain"
              />
              <Text style={tw`text-black mt-2`}>{selectedImage.filename}</Text>
              <Text style={tw`text-gray-600 text-sm`}>{selectedImage.dataFormatada}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={tw`mt-4`}>
                <Text style={tw`text-blue-500`}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
