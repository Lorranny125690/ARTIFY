import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL, useAuth } from "../AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";

export type ImageType = {
  type: number;
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
  favorite: boolean;
};

interface ImagesContextProps {
  images: ImageType[];
  fetchImages: () => void;
  loading: boolean;
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
  uploadImage: (imageUris: string[], filterName: string) => Promise<{ Ids: string[] } | void>;
  deleteImage: (image: ImageType) => Promise<void>;
  toggleFavorite: (image: ImageType) => Promise<void>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  getProcessamentoPorId: (id: string) => Promise<any>;
  Grayscale: (image: ImageType) => Promise<{ id: string } | void>;
  Negative: (image: ImageType) => Promise<{ id: string } | void>;
  Blur: (image: ImageType, amount: number) => Promise<{ id: string } | void>;
  Canny: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Pixelate: (image: ImageType) => Promise<{ id: string } | void>;
  RGBBoost: (img: ImageType, Amount1: number, amount2: number, amount3: number) => Promise<{ id: string } | void>;
  SkinWhitening: (image: ImageType) => Promise<{ id: string } | void>;
  Heat: (image: ImageType) => Promise<{ id: string } | void>;
  Rescale: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Translate: (img: ImageType, amount1: number, amount2: number) => Promise<{ id: string } | void>;
  Rotate: (img: ImageType, amount: number, amount1: number) => Promise<{ id: string } | void>;
  Cardinal: (img: ImageType, amount: number, amount1: number) => Promise<{ id: string } | void>;
  Crop: (img: ImageType, amount: number, amount1: number, amout3: number, amount4: number) => Promise<{ id: string } | void>;
  Background: (image: ImageType) => Promise<{ id: string } | void>;
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

      console.log("Resposta da API:", result.data);

      const imagesWithUrls: ImageType[] = imageProcessed.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");
        const agora = new Date()
      
        return {
          id: img.id,
          uri: img.public_url.startsWith("http") ? img.public_url : `${API_URL}${img.public_url}`,
          filename: `${agora.getFullYear()}-${agora.getMonth()+1}-${agora.getDate()}_${agora.getHours()}-${agora.getMinutes()}-${agora.getSeconds()}`,        
          dataFormatada,
          favorite: img.favorite ?? false,
          type: img.type
        };
      });      
      setImages(imagesWithUrls);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.msg || e.message);
      Alert.alert('error', 'Erro ao carregar imagens');
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
  const Blur = async (img: ImageType, Amount: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = { image_id: img.id, Amount };
      console.log("Enviando payload para blur:", payload);
  
      const response = await Axios.post(
        `/processes/defined/blur`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do blur:", response.data);
  
      await fetchImages();
      return { id: response.data.id };
    } catch (error: any) {
      console.error("Erro ao aplicar blur:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de desfoque.");
    }
  };

  const PencilSketch = (img: ImageType) => applyFilter("pencil_sketch_filter", img);
  const Cartoon = (img: ImageType) => applyFilter("cartoon_filter", img);
  const Sepia = (img: ImageType) => applyFilter("sepia_filter", img);
  const Flip = (img: ImageType) => applyFilter("flip", img);
  const ChangeBrightness = async (img: ImageType, amount: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        Amount: amount
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/change_brightness`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };
  const Canny = async (img: ImageType, amount: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        Amount: amount
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/canny`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };
  
  const Pixelate = (img: ImageType) => applyFilter("pixelate", img);
  const RGBBoost = async (img: ImageType, Amount1: number, amount2: number, amount3: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        Amount: {
          amountB: Amount1,
          amountG: amount2,
          amountR: amount3
        }
      };
  
      console.log("Enviando payload para rgb:", payload);
  
      const response = await Axios.post(
        `/processes/defined/rgb_Boost`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const SkinWhitening = (img: ImageType) => applyFilter("skin_Whitening", img);
  const Heat = (img: ImageType) => applyFilter("heat", img);
  const Rescale = async (img: ImageType, Scale: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        scale: Scale,
      };
  
      console.log("Enviando payload para rgb:", payload);
  
      const response = await Axios.post(
        `/processes/defined/reescale`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const Translate = async (img: ImageType, amount1: number, amount2: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        x: amount1,
        y: amount2,
      };
  
      console.log("Enviando payload para rgb:", payload);
  
      const response = await Axios.post(
        `/processes/defined/translate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const Rotate = async (img: ImageType, amount: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        angle: amount
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/rotate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const Cardinal = async (img: ImageType, amount: number, amount1: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        sx: amount,
        sy: amount1
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/cardinal_scale`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do canny:", response.data);
  
      const processedUrl = response.data?.image;
      console.log(processedUrl)
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const Crop = async (img: ImageType, amount: number, amount1: number, amount3: number, amount4: number): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        x: amount,
        y: amount1,
        w: amount3,
        h: amount4,
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/crop`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const processedUrl = response.data?.process?.id;
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const Face = async (img: ImageType, operation: string): Promise<{ id: string } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Token de autenticação ausente.");
        return;
      }
  
      const payload = {
        image_id: img.id,
        operation: operation
      };
  
      console.log("Enviando payload para canny:", payload);
  
      const response = await Axios.post(
        `/processes/defined/face_detection`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const processedUrl = response.data?.process?.id;
  
      await fetchImages();
  
      return { id: processedUrl };
    } catch (error: any) {
      console.error("Erro ao aplicar canny:", error?.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível aplicar o filtro de borda (Canny).");
    }
  };

  const filterMap: { [key: string]: (img: ImageType) => Promise<{ id: string } | void> } = {
    // 🎨 Filtros
    "Grayscale (Preto e Branco)": Grayscale,
    "Sepia": Sepia,
    "Filtro de Cartoon": Cartoon,
    "Filtro de Cor Personalizada (RGB Boost)": (img) => RGBBoost(img, 10, 10, 10),
    "Filtro de Inversão (Negative)": Negative,
    "Filtro de Brilho e Contraste": (img) => ChangeBrightness(img, 100),
    "Filtro de Clareamento de Pele": SkinWhitening,
    "Filtro de Calor (Thermal)": Heat,
    "Filtro de Desenho a Lápis": PencilSketch,
    "Filtro de Pintura a Óleo": (img) => Canny(img, 5),
  
    // 🌟 Especiais
    "Remove Background": Background,
    "Pixelização Total": Pixelate,
    "Blur": (img) => Blur(img, 7),
  
    // 🔄 Transformações
    "Resize": (img) => Rescale(img, 2),
    "Rotação": (img) => Rotate(img, 60),
    "Translação (warpAffine)": (img) => Translate(img, 30, 30),
    "Escala (Cardinal)": (img) => Cardinal(img, 10, 10),
    "Flip X": Flip,
    "Cropping": (img) => Crop(img, 5, 5, 2, 2),
  
    // ❓Possíveis futuros (você pode implementar depois)
    "Pixelização facial": (img) => Face(img, "censor"),
    // "Remover Background em Vídeo": removeVideoBackground,
    "Detecção de Rostos com IA": (img) => Face(img, "isolate"),
  };   

  const uploadImage = async (imageUris: string[], filterName: string): Promise<{ Ids: string[] } | void> => {
    try {
      const token = authState?.token;
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
  
      const uploadedIds: string[] = [];
  
      for (const uri of imageUris) {
        const formData = new FormData();
        formData.append("file", {
          uri,
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
          uploadedIds.push(imageId);
  
          if (filterMap[filterName]) {
            const imageObj = { id: imageId } as ImageType;
            await filterMap[filterName](imageObj);
          }
        } else {
          console.warn("Falha ao enviar uma das imagens.");
        }
      }
  
      await fetchImages();
      return { Ids: uploadedIds };
    } catch (error: any) {
      console.warn("Erro ao guardar imagem:", error);
      Alert.alert("Erro", error?.response?.data?.msg || "Erro ao enviar imagens.");
    }
  };  

  const getProcessamentoPorId = async (id: string) => {
    try {
      const token = authState?.token;
      const response = await Axios.get(`/processes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Processamento:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar processamento:", error);
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

  const toggleFavorite = async (image: ImageType) => {
    const favoriteValue = !image.favorite;
  
    try {
      await Axios.put(`processes/${image.id}`, {
        favorite: favoriteValue,
      });
  
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, favorite: favoriteValue } : img
        )
      );

      Alert.alert("Imagem favoritada!")
    } catch (e) {
      console.error("Erro ao favoritar:", e);
      Alert.alert("Erro", "Não foi possível alterar o favorito.");
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
        getProcessamentoPorId,
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
        Cardinal,
        Crop,
        Background
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