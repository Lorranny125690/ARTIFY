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
import { Star, StarOff } from "lucide-react-native";
import { useImagesServices } from "../images/Services/MinhasImagens";
import * as Animatable from 'react-native-animatable';

const BounceInRight = Animatable.createAnimatableComponent(View);

const bounceInFromRight = {
  0: {
    opacity: 0,
    translateX: 300,
  },
  0.6: {
    opacity: 1,
    translateX: -20,
  },
  0.75: {
    translateX: 10,
  },
  0.9: {
    translateX: -5,
  },
  1: {
    translateX: 0,
  },
};

function FallbackImage(props: ImageProps) {
  const [error, setError] = useState(false);
  const isRemote =
    props.source && typeof props.source === "object" && "uri" in props.source;

  return (
    <Image
      {...props}
      source={
        error || !isRemote
          ? require("../../assets/images.png")
          : props.source
      }
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
    setModalVisible,
    openModal,
  } = useFavoritos();

  const {
    handleImageSave,
    handleFavorite,
    handleDelete,
  } = useImagesServices();

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`items-center gap-2 flex-row m-2 py-2 px-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl`}>Favoritos</Text>
      </View>

      <Text style={tw`text-white text-xl mt-6 ml-3 mb-4`}>
        Imagens Favoritas
      </Text>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={tw`text-white mt-2`}>Carregando favoritos...</Text>
        </View>
      ) : images.length === 0 ? (
        <Text style={tw`text-white text-center mt-4`}>
          Nenhuma imagem favoritada.
        </Text>
      ) : (
        <ScrollView>
          <View style={tw`left-2 flex-row flex-wrap items-center px-2 gap-5`}>
            {images.map((image, index: number) => (
              <TouchableOpacity
                key={image.id}
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
      {modalVisible && selectedImage && (
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}>
          <Animatable.View
            animation="zoomIn"
            duration={300}
            easing="ease-out"
            style={tw`bg-slate-800 w-79 h-98 p-4 justify-center rounded-2 items-center`}
          >
            {selectedImage.uri ? (
              <Animatable.Image
                animation="fadeIn"
                delay={200}
                duration={500}
                source={{ uri: selectedImage.uri }}
                style={tw`absolute rounded-2 bottom-20 left-0 right-0 w-79 h-79`}
                resizeMode="cover"
              />
            ) : (
              <Text style={tw`text-white`}>Imagem indisponível</Text>
            )}

            <Animatable.View
              animation="fadeInUp"
              delay={300}
              duration={400}
              style={tw`absolute m-3 bottom-2 left-0 right-0 flex-row items-center justify-center`}
            >
              <View style={tw`flex-1`}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tw`text-white text-sm font-semibold`}
                >
                  {selectedImage.filename}
                </Text>
                <View style={tw`flex-row items-center mt-1`}>
                  <Text style={tw`text-white text-sm`}>{selectedImage.dataFormatada}</Text>
                </View>
              </View>

              <View style={tw`flex-row items-center ml-4 gap-2`}>
                <TouchableOpacity style={tw`items-center`} onPress={handleDelete}>
                <BounceInRight
                  animation={bounceInFromRight}
                  duration={1000}
                  useNativeDriver
                  >
                    <Icon name="trash" size={28} color="#62748E" />
                  </BounceInRight>
                  <Text style={tw`text-white text-xs`}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={tw`items-center`} onPress={handleImageSave}>
                  <BounceInRight
                  animation={bounceInFromRight}
                  duration={1000}
                  useNativeDriver
                  >
                    <Icon name="save" size={28} color="#62748E" />
                  </BounceInRight>
                  <Text style={tw`text-white text-xs`}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity style={tw`items-center`} onPress={handleFavorite}>
                <BounceInRight
                  animation={bounceInFromRight}
                  duration={1000}
                  useNativeDriver
                  >
                    {selectedImage.favorite ? (
                      <AntDesign name="star" size={28} color="#FFEB3B" />
                    ) : (
                      <AntDesign name="staro" size={28} color="#62748E" />
                    )}
                  </BounceInRight>
                  <Text style={tw`text-white text-xs`}>Favoritar</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </Animatable.View>
        </View>
        </Modal>
      )}
    </View>
  );
}