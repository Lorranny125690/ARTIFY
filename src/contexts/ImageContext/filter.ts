import Axios from "../../scripts/axios";
import { Alert } from "react-native";
import { ImageType } from "./types";

export const applyFilter = async (endpoint: string, image: ImageType, token: string): Promise<{ id: string } | void> => {
  try {
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

    return { id: response.data?.id };
  } catch (e: any) {
    Alert.alert("Erro", `Erro ao aplicar ${endpoint}`);
    console.error(e);
  }
};

// Exemplo de filtros individuais:
export const Grayscale = (img: ImageType, token: string) => applyFilter("grayscale", img, token);
export const Negative = (img: ImageType, token: string) => applyFilter("negative", img, token);
export const Background = (img: ImageType, token: string) => applyFilter("bg_remove", img, token);
export const PencilSketch = (img: ImageType, token: string) => applyFilter("pencil_sketch_filter", img, token);
export const Cartoon = (img: ImageType, token: string) => applyFilter("cartoon_filter", img, token);
export const Sepia = (img: ImageType, token: string) => applyFilter("sepia_filter", img, token);
export const Flip = (img: ImageType, token: string) => applyFilter("flip", img, token);
export const Pixelate = (img: ImageType, token: string) => applyFilter("pixelate", img, token);
export const SkinWhitening = (img: ImageType, token: string) => applyFilter("skin_Whitening", img, token);
export const Heat = (img: ImageType, token: string) => applyFilter("heat", img, token);
