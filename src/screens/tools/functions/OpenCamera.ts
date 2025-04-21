import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { RootStackParamList } from "../../../types/rootStackParamList";


export const openCamera = async ():Promise<string> => {
    console.log("Abrir camera")

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
      return "";
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      console.log(result)
      return selectedUri
    }else{
      console.log(result)
      return ""
    }
};