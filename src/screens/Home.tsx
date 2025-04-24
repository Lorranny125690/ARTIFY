import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import { RecentProcessedImages } from "./tools/functions/recentProcess";
import type { Images } from "../types/entitys/images";

type Item = {
  name: string;
  icon: string;
};

const toolSections: { title: string; data: Item[] }[] = [
  {
    title: "Filtros",
    data: [
      { name: "Filtro de Cor Personalizada (RGB Boost)", icon: "tint" },
      { name: "Filtro de Inversão (Negative)", icon: "adjust" },
      { name: "Filtro de Brilho e Contraste", icon: "sun-o" },
    ],
  },
  {
    title: "Transformações",
    data: [
      { name: "Resize", icon: "expand" },
      { name: "Translação (warpAffine)", icon: "arrows" },
      { name: "Rotação", icon: "repeat" },
    ],
  },
];

const Section: React.FC<{
  title: string;
  data: Item[];
  onPress?: (item: Item) => void;
}> = ({ title, data, onPress }) => (
  <View style={tw`mt-6 px-2 items-center`}>
    <Text style={tw`text-white text-lg font-semibold self-start`}>{title}</Text>
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPress?.(item)}
          style={tw`bg-slate-700 mb-10 w-28 h-28 p-3 rounded-lg items-center justify-center mx-2`}
        >
          <Icon name={item.icon} size={24} color="#fff" />
          <Text style={tw`text-white text-xs mt-2 text-center`}>{item.name}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={tw`mt-2 px-4 items-center`}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recentEdits,setRecentEdits] = useState<Images[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const loadRecentImages = await RecentProcessedImages();
      setRecentEdits(loadRecentImages);
    };
  
    fetchImages();
  }, []);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }

    alert("Só upa, não tem filtro funcional")
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-900`} contentContainerStyle={tw`pb-10`}>
      {/* Header ainda vou fazer como component nos componets para clean code*/} 
      <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <View style={tw`flex-row items-center`}>
          <Image source={require("../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Edições recentes */}
      <View style={tw`px-4 mb-10 mt-6`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Usadas recentemente</Text>
          {
            recentEdits.length > 0 ? (
              <FlatList
                horizontal
                data={recentEdits}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={tw`bg-slate-700 m-2 p-4 rounded-lg w-29 mx-2 items-center shadow-lg`}>
                    <Image 
                      source={
                        item.stored_filepath 
                          ? { uri: item.stored_filepath } 
                          : require("../assets/icon.png")
                      }
                      style={tw`w-16 h-16`} 
                    />
                    <Text style={tw`text-white text-xs mt-2 text-center`}>Grayscale</Text>
                  </View>
                )}
                contentContainerStyle={tw`items-center`}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={tw`text-gray-400 text-center mt-4`}>
                Nenhuma edição recente encontrada.
              </Text>
          )}
      </View>

      {/* Upload de imagem */}
      <TouchableOpacity
        onPress={handleImageUpload}
        style={tw`mb-10 bg-slate-800 p-4 rounded-lg mt-6 mx-4 items-center justify-center h-64 border-2 border-dashed border-gray-500`}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={tw`w-full h-full rounded-lg`} resizeMode="cover" />
        ) : (
          <>
            <Icon name="cloud-upload" size={40} color="#fff" />
            <Text style={tw`text-white mt-2`}>Upload de imagem</Text>
            <Text style={tw`text-gray-400 text-xs mt-1`}>Máximo 5MB</Text>
            <Text style={tw`text-gray-300 text-sm text-center mt-2 px-4`}>
              Aplique filtros incríveis, ajuste luz e cor, faça edições e muito mais. Tudo em um só lugar, rápido e intuitivo.
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Ferramentas agrupadas */}
      {toolSections.map((section) => (
        <Section onPress={(item) => alert(`${item.name} ainda será implementado!!!`)} key={section.title} title={section.title} data={section.data} />
      ))}

      {/* Footer */}
      <View style={tw`mt-8 py-4 gap-10 bg-slate-800 items-center justify-center top-10`}>
        <View style={tw`flex-row top-2 items-center`}>
          <Text style={tw`text-white mr-30 text-xl font-semibold mb-2`}>Redes sociais</Text>
          <Image source={require("../assets/iconArtify.png")} style={tw`w-20 h-9`}/>
        </View>
        <View style={tw`gap-10 flex-row justify-around w-full max-w-xs`}>
          {["facebook", "github", "envelope", "instagram", "twitter"].map((icon) => (
            <Icon key={icon} name={icon} size={20} color="#fff" />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};