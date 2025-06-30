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
import { API_URL, useAuth } from "../contexts/AuthContext/authenticatedUser";
import Axios from "../scripts/axios";
import * as Animatable from "react-native-animatable";


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
  <Animatable.View
    animation="fadeInUp"
    duration={500}
    delay={100}
    useNativeDriver
    style={tw`mt-10 px-2 items-center`}
  >
    <Text style={tw`text-white text-lg left-5 font-semibold self-start`}>{title}</Text>

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
  </Animatable.View>
);


type ImageType = {
  type: number;
  id: string;
  uri: string;
  filename: string;
  nome: string;
  dataFormatada: string;
  favorite: boolean;
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recentEdits,setRecentEdits] = useState<ImageType[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const { authState } = useAuth();
  const token = authState?.token;

  const history = async () => {
    setLoading(true);
    try {
      const result = await Axios.get("/images", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const simplifiedList = result.data.simplified;

      const imageProcessed = simplifiedList
        .filter((img: any) => img.type === 1)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const imagesWithUrls: ImageType[] = imageProcessed.map((img: any) => {
        const data = img.date ? new Date(img.date) : new Date();
        const dataFormatada = data.toLocaleDateString("pt-BR");
        const agora = new Date();

        return {
          id: img.id,
          uri: img.public_url.startsWith("http") ? img.public_url : `${API_URL}${img.public_url}`,
          filename: `Editado em ${dataFormatada}`,
          dataFormatada,
          nome: img.filename,
          favorite: img.favorite ?? false,
          type: img.type,
        };
      });

      setRecentEdits(imagesWithUrls);
    } catch (e: any) {
      console.warn("Erro ao buscar imagens:", e?.response?.data?.msg || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      history();
    }
  }, [authState?.authenticated]);

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
      <Animatable.View
        animation="fadeInUp"
        delay={50}
        duration={500}
        useNativeDriver
        style={tw`px-4 mb-10 mt-6`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Usadas recentemente</Text>
        {recentEdits.length > 0 ? (
          <FlatList
            horizontal
            data={recentEdits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Photo", { imageId: item.id })}
                style={tw`bg-slate-700 p-3 rounded-lg mx-2 top--3 items-center w-28 h-35`}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={tw`w-28 h-35 rounded-lg`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={tw`items-center`}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={tw`text-gray-400 text-center mt-4`}>
            Nenhuma edição recente encontrada.
          </Text>
        )}
      </Animatable.View>

      {/* Ferramentas agrupadas */}
      {toolSections.map((section) => (
        <Section onPress={(item) => alert(`${item.name} ainda será implementado!!!`)} key={section.title} title={section.title} data={section.data} />
      ))}

      {/* Footer */}
      <View style={tw`bottom-0 top-10 py-4 gap-10 bg-slate-800 items-center justify-center`}>
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