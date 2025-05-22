import { useEffect, useState } from "react";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export type ImageType = {
  id: string; uri: string, filename: string, dataFormatada: string, user_favorite: boolean,
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

      const imageList = result.data.images;

      console.log(imageList)   
      const imagesWithUrls = imageList.map((img: any) => {
        const data = new Date(img.created_at);
        const dataFormatada = data.toLocaleDateString("pt-BR");
      
        return {
          id: img.Id,
          uri: img.stored_filepath.startsWith("http")
            ? img.stored_filepath
            : `${API_URL}${img.stored_filepath}`,
          filename: img.original_filename,
          dataFormatada,
          user_favorite: img.user_favorite ?? false,
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
      const isFavorite = image?.user_favorite;

      const token = authState?.token;
      await Axios.put(
        "/images",
        {
          imageId: image.id,
          user_favorite: !isFavorite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Alert.alert("Sucesso", isFavorite ? "Imagem favoritada!" : "Imagem desmarcada como favorita.");
  
      const updatedImages = images.map((img) =>
        img.id === image.id ? { ...img, user_favorite: isFavorite } : img
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