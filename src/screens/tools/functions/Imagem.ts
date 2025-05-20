import { Alert } from "react-native";
import { API_URL } from "../../../contexts/AuthContext/authenticatedUser";

interface formDataUpload{
  uri: string,
  name: string,
  type: string,
}

export const uploadImage = async (
  imageUri: string,
  token: string,
  onSuccess: () => void
) => {
  try {
    alert("Fazendo upload de uma imagem")
    const formData = new FormData();
    if(!imageUri){
      throw new Error("ImageUri is null")
    }
        
    formData.append("images", {
        uri: imageUri,
        type: "image/jpeg",
        name: "foto.jpg"
      } as any);

      const response = await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
});

const resText = await response.text();
console.log("Status:", response.status);
console.log("Resposta do backend:", resText);
    onSuccess();
  } catch (error) {
    console.error("Erro ao fazer upload: ", error);
    Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
  }
};

