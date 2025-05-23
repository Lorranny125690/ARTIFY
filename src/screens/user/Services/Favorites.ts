import { useEffect, useState } from "react";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";

export type ImageType = {
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
};

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
  
      const result = await Axios.get("/images/favorite", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const imageList = result.data?.images?.images;
  
      if (!Array.isArray(imageList)) {
        console.warn("Resposta inesperada da API: images não é uma lista", result.data);
        setImages([]);
        return;
      }
  
      const formattedImages = imageList.map((img: any) => {
        const data = new Date(img.created_at);
        const dataFormatada = data.toLocaleDateString("pt-BR");
  
        return {
          id: img.Id,
          uri: img.stored_filepath?.startsWith("http")
            ? img.stored_filepath
            : `${API_URL}${img.stored_filepath}`,
          filename: img.original_filename || "",
          dataFormatada,
        };
      });
  
      setImages(formattedImages);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.msg || e.message);
      Alert.alert("Erro", "Não foi possível carregar as imagens.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };  

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  useEffect(() => {
    if (authState?.authenticated) {
      fetchImages();
    }
  }, [authState?.authenticated]);

  return {
    images,
    loading,
    modalVisible,
    selectedImageIndex,
    openModal,
    setModalVisible,
  };
}
