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

      const result = await Axios.get("/images", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allImages = result.data.simplified || [];

      const favorites = allImages.filter((img: any) => img.favorite === true);

      const imagesWithUrls: ImageType[] = favorites.map((img: any) => {
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
