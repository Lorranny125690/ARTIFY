import { useEffect, useState } from "react";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import { useImagesContext } from "../../../contexts/ImageContext/imageContext";
import { ImageType } from "../../../contexts/ImageContext/imageContext"

export function useImagesServices() {
  const { images, setImages, uploadImage, deleteImage, toggleFavorite } = useImagesContext();
  const [image, setImage] = useState<ImageType[]>([]);
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

      const allImages = result.data.simplified || [];

      const imageProcessed = allImages.filter((img: any) => img.type === "processed");

      const imagesWithUrls: ImageType[] = imageProcessed.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");

        return {
          id: img.id,
          uri: img.public_url.startsWith("http")
            ? img.public_url
            : `${API_URL}${img.public_url}`,
          filename: img.filename,
          dataFormatada,
          user_favorite: true,
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

  const handleDelete = () => {
    if (selectedImageIndex === null) return;
    deleteImage(images[selectedImageIndex]);
    setModalVisible(false);
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
    fetchImages,
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
