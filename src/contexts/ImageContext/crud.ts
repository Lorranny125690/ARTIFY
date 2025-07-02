// 📁 src/context/ImagesContext/actions.ts

import { Alert } from "react-native";
import Axios from "../../scripts/axios";
import { ImageType } from "./types";

export const deleteImage = async (image: ImageType, token: string): Promise<void> => {
  try {
    await Axios.delete(`/processes/${image.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert("Sucesso", "Imagem excluída com sucesso.");
  } catch (e: any) {
    Alert.alert("Erro", "Não foi possível excluir a imagem.");
    console.error("Erro ao excluir imagem:", e?.response?.data?.msg || e?.message || "Erro desconhecido");
  }
};

export const toggleFavorite = async (image: ImageType, token: string): Promise<void> => {
  try {
    await Axios.put(`processes/${image.id}`, {
      favorite: !image.favorite,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    Alert.alert("Imagem favoritada!");
  } catch (e: any) {
    Alert.alert("Erro", "Não foi possível alterar o favorito.");
    console.error("Erro ao favoritar:", e);
  }
};

export const getProcessamentoPorId = async (id: string, token: string) => {
  try {
    const response = await Axios.get(`/processes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (e: any) {
    console.error("Erro ao buscar processamento:", e);
    Alert.alert("Erro", "Não foi possível buscar o processamento.");
  }
};