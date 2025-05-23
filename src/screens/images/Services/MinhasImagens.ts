import { useEffect, useState } from "react";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";

export type ImageType = {
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
  user_favorite: boolean;
};

export function useImagesServices() {
  const [images, setImages] = useState<ImageType[]>([]);
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
  
      const simplifiedList = result.data.simplified;
  
      const imagesWithUrls: ImageType[] = simplifiedList.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");
  
        return {
          id: img.id,
          uri: img.public_url.startsWith("http")
            ? img.public_url
            : `${API_URL}${img.public_url}`,
          filename: "",
          dataFormatada,
          user_favorite: img.favorite,
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

  useEffect(() => {
    if (authState?.authenticated) {
      fetchImages();
    }
  }, [authState?.authenticated]);

  const handleDelete = (deleteImage: ImageType) => {
    Alert.alert(
      "Excluir imagem",
      "Tem certeza que deseja excluir esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const token = authState?.token;
  
              await Axios.delete(`/images/${deleteImage.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
  
              // Atualiza a lista local
              const updatedImages = images.filter(image => image.id !== deleteImage.id);
              setImages(updatedImages);
              Alert.alert("Sucesso", "Imagem excluída com sucesso.");
              setModalVisible(false);
            } catch (e: any) {
              console.warn("Erro ao excluir imagem:", e?.response?.data?.msg || e.message);
              Alert.alert("Erro", "Não foi possível excluir a imagem.");
            }
          },
        },
      ],
      { cancelable: false }
    );
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

  const handleFavorite = async () => {
    try {
      if (selectedImageIndex === null) return;
  
      const image = images[selectedImageIndex];
      const isCurrentlyFavorite = image?.user_favorite;
      const newFavoriteStatus = !isCurrentlyFavorite;
  
      const token = authState?.token;
      await Axios.put(
        "/images",
        {
          imageId: image.id,
          user_favorite: newFavoriteStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Alert.alert(
        "Sucesso",
        newFavoriteStatus ? "Imagem favoritada!" : "Imagem desmarcada como favorita."
      );

      console.log(newFavoriteStatus)
  
      const updatedImages = images.map((img) =>
        img.id === image.id ? { ...img, user_favorite: newFavoriteStatus } : img
      );
      setImages(updatedImages);
    } catch (error: any) {
      console.error("Erro ao favoritar/desfavoritar imagem:", error?.response?.data?.msg || error.message);
      Alert.alert("Erro", "Não foi possível atualizar a imagem.");
    }
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
    openModal,
    handleImageEdit,
    handleDelete,
    handleImageSave,
    handleFavorite,
    setModalVisible,
  };
}