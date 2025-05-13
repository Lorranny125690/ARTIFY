import { Alert } from "react-native";
import { API_URL } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";

export const uploadImage = async (
  imageUri: string,
  token: string,
  onSuccess: () => void
) => {
  try {
    const fileName = imageUri.split("/").pop() || "imagem.jpg";

    const formData = new FormData();
    formData.append("images", {
      uri: imageUri,
      name: fileName,
      type: "image/jpg",
    } as any);

    const response = await Axios.post(`${API_URL}/images`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload sucesso:", response.data);
    onSuccess();
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
  }
};

