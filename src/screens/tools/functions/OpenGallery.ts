import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const openGallery = async ():Promise<string> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à galeria.");
      return "";
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      return selectedUri  
    }else{
      return ""
    }

};