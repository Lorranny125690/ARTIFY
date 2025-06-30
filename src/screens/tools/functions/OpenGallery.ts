import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

type PickedAsset = {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
};

export const openGallery = async (): Promise<string[]> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert("Permissão negada", "Precisamos de acesso à galeria.");
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    const uris = result.assets.slice(0, 5).map(asset => asset.uri); // sem tipagem manual
    return uris;
  } else {
    return [];
  }
};

