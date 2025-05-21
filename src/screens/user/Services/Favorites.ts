import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../../types/rootStackParamList";
import { useEffect, useState } from "react";
import { API_URL, useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import AsyncStorage from "@react-native-async-storage/async-storage";

export type ImageType = {
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
  favorito?: boolean;
};

export function useImagesServices() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authState } = useAuth();

  const getFavoritosStorage = async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem("favoritos");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveFavoritosStorage = async (favoritos: string[]) => {
    await AsyncStorage.setItem("favoritos", JSON.stringify(favoritos));
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = authState?.token;
      const result = await Axios.get("/images/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const favoritosIds = await getFavoritosStorage();
      const imageList = result.data.images;

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
          favorito: favoritosIds.includes(img.Id),
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

  const toggleFavorite = async (imageId: string) => {
    try {
      const token = authState?.token;
      const favoritos = await getFavoritosStorage();
      let updated: string[];
      const isFavorito = favoritos.includes(imageId);
  
      if (isFavorito) {
        updated = favoritos.filter(id => id !== imageId);
        // Chamada para remover dos favoritos no backend
        await Axios.delete(`/images/favorite/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        updated = [...favoritos, imageId];
        // Chamada para adicionar aos favoritos no backend
        await Axios.post(
          `/images/favorite/${imageId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      await saveFavoritosStorage(updated);
  
      // Atualiza localmente
      setImages(prev =>
        prev.map(img =>
          img.id === imageId ? { ...img, favorito: !img.favorito } : img
        )
      );
    } catch (e: any) {
      console.warn("Erro ao alterar favorito:", e?.response?.data?.msg || e.message);
      Alert.alert("Erro", "Não foi possível alterar o favorito.");
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
    toggleFavorite, // exporta aqui
  };
}