import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL, useAuth } from "../AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";

export type ImageType = {
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
  user_favorite: boolean;
};

interface ImagesContextProps {
  images: ImageType[];
  fetchImages: () => void;
  loading: boolean;
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
  uploadImage: (imageUri: string) => Promise<void>;
  deleteImage: (image: ImageType) => Promise<void>;
  toggleFavorite: (image: ImageType) => Promise<void>;
}

const ImagesContext = createContext<ImagesContextProps | undefined>(undefined);

export const ImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageType[]>([]);
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
          filename: img.filename,
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

  const uploadImage = async (imageUri: string) => {
    try {
      if (!imageUri) throw new Error("URI da imagem ausente.");

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "foto.jpg",
      } as any);

      const token = authState?.token;
      if (!token) throw new Error("Token de autenticação ausente.");

      const response = await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erro do servidor: ${errText}`);
      }

      await fetchImages();
    } catch (error: any) {
      console.error("Erro ao fazer upload: ", error?.message || error);
      Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
    }
  };

  const deleteImage = async (imageToDelete: ImageType) => {
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
              if (!token) throw new Error("Token não encontrado.");

              await Axios.delete(`/images/${imageToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              const updatedImages = images.filter((img) => img.id !== imageToDelete.id);
              setImages(updatedImages);

              Alert.alert("Sucesso", "Imagem excluída com sucesso.");
            } catch (e: any) {
              console.warn("Erro ao excluir imagem:", e?.response?.data?.msg || e?.message || "Erro desconhecido");
              Alert.alert("Erro", e?.response?.data?.msg || e?.message || "Não foi possível excluir a imagem.");
            }            
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleFavorite = async (imageToToggle: ImageType) => {
    try {
      const newFavoriteStatus = !imageToToggle.user_favorite;
      const token = authState?.token;

      if (!token) throw new Error("Token não encontrado.");

      await Axios.put(
        "/images",
        {
          imageId: imageToToggle.id,
          user_favorite: newFavoriteStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedImages = images.map((img) =>
        img.id === imageToToggle.id ? { ...img, user_favorite: newFavoriteStatus } : img
      );

      setImages(updatedImages);

      Alert.alert(
        "Sucesso",
        newFavoriteStatus ? "Imagem favoritada!" : "Imagem desmarcada como favorita."
      );
    } catch (error: any) {
      console.error("Erro ao favoritar imagem:", error?.response?.data?.msg || error.message);
      Alert.alert("Erro", "Não foi possível atualizar a imagem.");
    }
  };

  return (
    <ImagesContext.Provider
      value={{
        images,
        fetchImages,
        loading,
        setImages,
        uploadImage,
        deleteImage,
        toggleFavorite,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export const useImagesContext = () => {
  const context = useContext(ImagesContext);
  if (!context) throw new Error("useImagesContext deve ser usado dentro de ImagesProvider");
  return context;
};
