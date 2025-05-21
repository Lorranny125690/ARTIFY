import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageProps,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useImagesServices } from "./Services/Favorites";
import type { RootStackParamList } from "../../types/rootStackParamList";

function FallbackImage(props: ImageProps) {
  const [error, setError] = React.useState(false);

  const isRemote = props.source && typeof props.source === "object" && "uri" in props.source;

  return (
    <Image
      {...props}
      source={error || !isRemote ? require("../../assets/images.png") : props.source}
      onError={() => setError(true)}
    />
  );
}

export function Favoritos() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const { images, loading, openModal } = useImagesServices();

  const favoritos = images.filter(img => img.favorito);

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* Header */}
      <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <Image
          source={require("../../assets/iconArtify.png")}
          style={tw`w-20 h-9`}
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={tw`text-white text-xl ml-5 mb-7 mt-2`}>Imagens favoritas</Text>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={tw`text-white mt-2`}>Carregando favoritos...</Text>
        </View>
      ) : favoritos.length === 0 ? (
        <Text style={tw`text-white text-center mt-4`}>Nenhuma imagem favoritada.</Text>
      ) : (
        <ScrollView>
          <View style={tw`left-2 flex-row flex-wrap px-2 gap-5`}>
            {favoritos.map((image, index) => (
              <TouchableOpacity key={image.id} onPress={() => openModal(index)}>
                <FallbackImage
                  source={{ uri: image.uri }}
                  style={tw`w-30 h-30 rounded-4`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
