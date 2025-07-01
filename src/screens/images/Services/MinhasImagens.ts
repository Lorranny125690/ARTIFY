import { useEffect, useState } from "react";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import { useImagesContext } from "../../../contexts/ImageContext/imageContext";
import { ImageType } from "../../../contexts/ImageContext/imageContext";
import { CustomModal } from "../../auth/Modal";

export function useImagesServices() {
  const { images, setImages, uploadImage, deleteImage, toggleFavorite } = useImagesContext();
  const [image, setImage] = useState<ImageType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authState } = useAuth();
  const [modalMsg, setModalMsg] = useState("");


  const handleDelete = () => {
    if (selectedImageIndex === null) return;
    deleteImage(images[selectedImageIndex]);
    setModalVisible(false);
    setModalMsg("Deletada com sucesso!")
  };

  const handleFavorite = async () => {
    if (selectedImageIndex === null) return;
    await toggleFavorite(images[selectedImageIndex]);
    setModalVisible(false);
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

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  return {
    images,
    loading,
    modalVisible,
    selectedImageIndex,
    setSelectedImageIndex,
    openModal,
    handleDelete,
    handleImageSave,
    handleFavorite,
    setModalVisible,
    uploadImage,
  };
}
