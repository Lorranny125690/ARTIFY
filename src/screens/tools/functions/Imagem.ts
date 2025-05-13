import { Alert } from "react-native";
import { API_URL } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";

export const uploadImage = async (
  imageUri: string,
  token: string,
  onSuccess: () => void
) => {
  try {
    const formData = new FormData();
    formData.append("images", JSON.parse(JSON.stringify({
      uri: imageUri,
      type: "image/png",
    })));

    const response = await Axios.post(`/images`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Upload sucesso:", response.data);
    onSuccess();
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
  }
};

