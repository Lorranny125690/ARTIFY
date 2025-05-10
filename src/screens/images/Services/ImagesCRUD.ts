import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const uploadImage = async (mode: "camera" | "gallery") => {
    try {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permissão para acessar a câmera é necessária!");
        return;
      }

      let result;
      if (mode === "gallery") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets?.length) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error: any) {
      alert("Erro ao importar: " + error.message);
      setModalVisible(false);
    }
  };

  const saveImage = async (uri: string | null) => {
    setImage(uri);
    setModalVisible(false);
  };

  const removeImage = async () => {
    try {
      await saveImage(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return {
    image,
    modalVisible,
    setModalVisible,
    uploadImage,
    removeImage,
  };
};
