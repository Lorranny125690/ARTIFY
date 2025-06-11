import { Alert } from "react-native";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";
import { useEffect, useState } from "react";
import type { ImageType } from "../../../contexts/ImageContext/imageContext";

export function useFavoritos() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { authState } = useAuth();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = authState?.token;
      
      const result = await Axios.get("/processes/favorite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log({
        Description:"Got a result",
        resultType:result.data,
        resultStatus:result.status
      })
      // Pega o array de imagens no formato novo
      const allImages = result.data.images || [];

      // Mapeia para o formato ImageType esperado
      const imagesWithUrls: ImageType[] = allImages.map((img: any) => {
        const data = img.createdAt ? new Date(img.createdAt) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");

        // filename pode não existir na nova API, tenta extrair do URL
        const filename = img.imageUrl.split("/").pop() || "unknown";

        return {
          id: img.id,
          uri: img.imageUrl.startsWith("http") ? img.imageUrl : `${API_URL}${img.imageUrl}`,
          filename,
          dataFormatada,
          user_favorite: true,
        };
      });

      setImages(imagesWithUrls);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.error || e.message);
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
    setModalVisible,
  };
}