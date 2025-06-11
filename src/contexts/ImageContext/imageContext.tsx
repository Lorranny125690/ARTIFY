import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL, useAuth } from "../AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";

export type ImageType = {
  type: string;
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
  uploadImage: (imageUri: string, filterName: string) => Promise<{ Id: string } | void>;
  deleteImage: (image: ImageType) => Promise<void>;
  toggleFavorite: (image: ImageType) => Promise<void>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;

  Grayscale: (image: ImageType) => Promise<{ id: string } | void>;
  Negative: (image: ImageType) => Promise<{ id: string } | void>;
  Blur: (image: ImageType, amount: number) => Promise<{ id: string } | void>;
  Canny: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Pixelate: (image: ImageType) => Promise<{ id: string } | void>;
  RGBBoost: (image: ImageType) => Promise<{ id: string } | void>;
  SkinWhitening: (image: ImageType) => Promise<{ id: string } | void>;
  Heat: (image: ImageType) => Promise<{ id: string } | void>;
  Rescale: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Translate: (image: ImageType) => Promise<{ id: string } | void>;
  Rotate: (image: ImageType) => Promise<{ id: string } | void>;
  CardinalScale: (image: ImageType) => Promise<{ id: string } | void>;
  Crop: (image: ImageType) => Promise<{ id: string } | void>;
}

const ImagesContext = createContext<ImagesContextProps | undefined>(undefined);

export const ImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { authState } = useAuth();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = authState?.token;
      const result = await Axios.get("/images", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const simplifiedList = result.data.simplified;
      const imageProcessed = simplifiedList.filter((img: any) => img.type === 1);

      const imagesWithUrls: ImageType[] = imageProcessed.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");

        return {
          id: img.id,
          uri: img.public_url.startsWith("http") ? img.public_url : `${API_URL}${img.public_url}`,
          filename: img.filename,
          dataFormatada,
          user_favorite: img.user_favorite,
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

  useEffect(() => {
    if (authState?.authenticated) {
      fetchImages();
    }
  }, [authState?.authenticated]);

  const applyFilter = async (endpoint: string, image: ImageType): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) throw new Error("Token de autenticação ausente.");
  
      const response = await Axios.post(
        `/processes/defined/${endpoint}`,
        { image_id: image.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const filteredId = response.data.id;
      Alert.alert("Sucesso", `Filtro '${endpoint}' aplicado com sucesso!`);
      await fetchImages();
      return { id: filteredId };
    } catch (error: any) {
      console.error(`Erro ao aplicar filtro ${endpoint}:`, error?.response?.data?.error || error.message);
      Alert.alert("Erro", `Não foi possível aplicar o filtro ${endpoint} à imagem.`);
    }
  };  

  const Grayscale = (img: ImageType) => applyFilter("grayscale", img);
  const Negative = (img: ImageType) => applyFilter("negative", img);
  const Background = (img: ImageType) => applyFilter("bg_remove", img);
  const Blur = async (img: ImageType, amount: number) => {
    try {
      const token = authState?.token;

      const response = await Axios.post(
        `/processes/defined/blur`,
        {
          image_id: img.id,
          Amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Erro ao aplicar blur:", error);
    }
  };
  const Canny = async (img: ImageType, amount: number) => {
    try {
      const token = authState?.token;
  
      const response = await Axios.post(
        `/processes/defined/canny`,
        {
          image_id: img.id,
          Amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Erro ao aplicar canny:", error);
      Alert.alert("Erro", "Não foi possível aplicar o filtro Canny à imagem.");
    }
  };  
  const Pixelate = (img: ImageType) => applyFilter("pixelate", img);
  const RGBBoost = (img: ImageType) => applyFilter("rgb_boost", img);
  const SkinWhitening = (img: ImageType) => applyFilter("skin_whitening", img);
  const Heat = (img: ImageType) => applyFilter("heat", img);
  const Rescale = async (img: ImageType, amount: number) => {
    try {
      const token = authState?.token;

      const response = await Axios.post(
        `/processes/defined/rescale`,
        {
          image_id: img.id,
          Amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Erro ao aplicar blur:", error);
    }
  };
  const Translate = (img: ImageType) => applyFilter("translate", img);
  const Rotate = (img: ImageType) => applyFilter("rotate", img);
  const CardinalScale = (img: ImageType) => applyFilter("cardinal_scale", img);
  const Crop = (img: ImageType) => applyFilter("crop", img);

  const filterMap: { [key: string]: (img: ImageType) => Promise<{ id: string } | void> } = {
    "Grayscale (Preto e Branco)": Grayscale,
    "Filtro de Inversão (Negative)": Negative,
    "Remove Background": Background,
    "Pixelização Total": Pixelate,
    "Filtro de Clareamento de Pele": SkinWhitening,
    "Filtro de Calor (Thermal)": Heat,
    "RGB Boost": RGBBoost,
    "Blur": (img) => Blur(img, 5),
    "Canny": (img) => Canny(img, 10),
    "Rescale": (img) => Rescale(img, 2),
  };  

  const uploadImage = async (imageUri: string, filterName: string): Promise<{ Id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      } as any);

      const response = await Axios.post("/images", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const imageId = response.data.image.Id;
        Alert.alert("Sucesso", `Imagem enviada com sucesso!`);

        let filterResult;

        const imageObj = { id: imageId } as ImageType;
        if (filterMap[filterName]) {
          filterResult = await filterMap[filterName](imageObj);
        }

        await fetchImages();
        return { Id: filterResult?.id ?? imageId};
      } else {
        Alert.alert("Erro", "Erro ao enviar a imagem.");
      }
    } catch (error: any) {
      console.warn("Erro ao guardar imagem:", error);
      Alert.alert("Erro", error?.response?.data?.msg || "Erro ao enviar imagem.");
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

              await Axios.delete(`/processes/${imageToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
              Alert.alert("Sucesso", "Imagem excluída com sucesso.");
            } catch (e: any) {
              console.warn("Erro ao excluir imagem:", e?.response?.data?.msg || e?.message || "Erro desconhecido");
              Alert.alert("Erro", "Não foi possível excluir a imagem.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleFavorite = async (imageToToggle: ImageType) => {
    try {
      const token = authState?.token;
      if (!token) throw new Error("Token não encontrado.");

      const newFavoriteStatus = !imageToToggle.user_favorite;

      await Axios.put(
        `/processes/${imageToToggle.id}`,
        { favorite: newFavoriteStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageToToggle.id ? { ...img, user_favorite: newFavoriteStatus } : img
        )
      );

      Alert.alert("Sucesso", newFavoriteStatus ? "Imagem favoritada!" : "Imagem removida dos favoritos.");
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
        selectedFilter,
        setSelectedFilter,
        Grayscale,
        Negative,
        Blur,
        Canny,
        Pixelate,
        RGBBoost,
        SkinWhitening,
        Heat,
        Rescale,
        Translate,
        Rotate,
        CardinalScale,
        Crop
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
