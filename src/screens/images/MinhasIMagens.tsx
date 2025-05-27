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
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useImagesServices } from "./Services/MinhasImagens";
import type { RootStackParamList } from "../../types/rootStackParamList";
import { Star, StarOff } from "lucide-react-native";

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
    handleFavorite,
    setModalVisible,
  } = useImagesServices();

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <Image
          source={require("../../assets/iconArtify.png")}
          style={tw`w-20 h-9`}
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={tw`text-white text-xl ml-5 mb-7 mt-2`}>Minhas imagens...</Text>

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
          <View style={tw`left-2 flex-row flex-wrap items-center px-2 gap-5`}>
            {images.map((image, index: number) => (
              <TouchableOpacity key={image.id} onPress={() => openModal(index)}>
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

      {/* Modal */}
      {selectedImageIndex !== null && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}>
            <View style={tw`bg-slate-800 w-79 h-98 p-4 justify-center rounded-2 items-center`}>
              <FallbackImage
                source={{ uri: images[selectedImageIndex].uri }}
                style={tw`absolute rounded-2 bottom-20 left-0 right-0 w-79 h-79`}
                resizeMode="cover"
              />

              <View style={tw`absolute m-3 bottom-2 left-0 right-0 flex-row items-center justify-center`}>
                {/* Informações da imagem */}
                <View style={tw`flex-1`}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={tw`text-white text-sm font-semibold`}
                  >
                    {images[selectedImageIndex]?.filename}
                  </Text>
                  <View style={tw`flex-row items-center mt-1`}>
                  <Text style={tw`text-white text-sm`}>{images[selectedImageIndex]?.dataFormatada}</Text>
                  </View>
                </View>

                {/* Botões */}
                <View style={tw`flex-row items-center ml-4 gap-2`}>
                  <TouchableOpacity style={tw`items-center`} onPress={() => handleDelete(images[selectedImageIndex])} >
                    <Icon name="trash" size={28} color="#62748E" />
                    <Text style={tw`text-white text-xs`}>Excluir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={tw`items-center`} onPress={handleImageSave}>
                    <Icon name="save" size={28} color="#62748E" />
                    <Text style={tw`text-white text-xs`}>Download</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={tw`items-center`} onPress={() => handleFavorite()}>
  {images[selectedImageIndex]?.user_favorite ? (
    <Star color="#62748E" size={28} />
  ) : (
    <StarOff color="#62748E" size={28} />
  )}
  <Text style={tw`text-white text-xs`}>Favoritar</Text>
</TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
