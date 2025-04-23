import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/rootStackParamList";
import { openCamera } from "./functions/OpenCamera";
import { openGallery } from "./functions/OpenGallery";
import { RecentProcessedImages } from "./functions/recentProcess";
import { Images } from "../../scripts/AuthContext/entitys/images";

type NavigationProp = StackNavigationProp<RootStackParamList>;

type Item = {
  name: string;
  icon: string;
};

const toolSections: { title: string; data: Item[] }[] = [
  {
    title: "Filtros",
    data: [
      { name: "Grayscale (Preto e Branco)", icon: "adjust" },
      { name: "Sepia", icon: "coffee" },
      { name: "Filtro de Cartoon", icon: "smile-o" },
      { name: "Filtro de Cor Personalizada (RGB Boost)", icon: "tint" },
      { name: "Filtro de Inversão (Negative)", icon: "adjust" },
      { name: "Filtro de Brilho e Contraste", icon: "sun-o" },
      { name: "Filtro de Clareamento de Pele", icon: "smile-o" },
      { name: "Filtro de Calor (Thermal)", icon: "thermometer-half" },
      { name: "Filtro de Desenho a Lápis", icon: "pencil" },
      { name: "Filtro de Pintura a Óleo", icon: "paint-brush" },
    ],
  },
  {
    title: "Detecção e Realce",
    data: [
      { name: "Grayscale (Preto e Branco)", icon: "adjust" },
      { name: "Color Enhancer", icon: "magic" },
      { name: "Chromatic Aberration", icon: "eye" },
    ],
  },
  {
    title: "Transformações",
    data: [
      { name: "Resize", icon: "expand" },
      { name: "Rotação", icon: "repeat" },
      { name: "Translação (warpAffine)", icon: "arrows" },
      { name: "Escala (Cardinal)", icon: "arrows-alt" },
      { name: "Flip X", icon: "exchange" },
      { name: "Cropping", icon: "crop" },
    ],
  },
  {
    title: "Especiais",
    data: [
      { name: "Remove Background", icon: "scissors" },
      { name: "Pixelização facial", icon: "th-large" },
      { name: "Pixelização Total", icon: "th" },
      { name: "Blur Facial", icon: "eye-slash" },
      { name: "Remover Background em Vídeo", icon: "video-camera" },
      { name: "Detecção de Rostos com IA", icon: "user-circle" },
    ],
  },
];

//Esse é o componente de cada ferramenta
export const Section: React.FC<{ title: string; data: Item[] }> = ({ title, data }) => {
  const [selectedTool, setSelectedTool] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>()

  const openModal = (item: Item) => {
    setSelectedTool(item);
    setModalVisible(true);
  };

  const cameraHandle = async ()=>{
    const ls = await openCamera()
    setModalVisible(false)
    navigation.navigate("Photo", { imageUri: ls });
  }
  const galleryHandle = async ()=>{
    const ls = await openGallery()
    setModalVisible(false)
    navigation.navigate("Photo", { imageUri: ls });
  }


  return (
    <View style={tw`mt-6 px-2 items-center`}>
      <Text style={tw`text-white text-lg font-semibold self-start`}>{title}</Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={tw`bg-slate-700 w-28 h-28 p-3 rounded-lg items-center justify-center mx-2`}
          >
            <Icon name={item.icon} size={24} color="#fff" />
            <Text style={tw`text-white text-xs mt-2 text-center`}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={tw`mt-2 px-4 items-center`}
        showsHorizontalScrollIndicator={false}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={tw`flex-1 justify-end bg-black bg-opacity-30`}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={tw`bg-slate-800 rounded-t-2xl p-4`}>
            <Text style={tw`text-white text-base text-center mb-4`}>
              Como deseja abrir a imagem?
            </Text>

            <TouchableOpacity
              onPress={cameraHandle}
              style={tw`bg-blue-500 px-4 py-3 rounded-lg mb-2`}
            >
              <Text style={tw`text-white text-center font-semibold`}>Abrir Câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={galleryHandle}
              style={tw`bg-green-500 px-4 py-3 rounded-lg mb-2`}
            >
              <Text style={tw`text-white text-center font-semibold`}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`px-4 py-2 rounded-lg mt-2`}
            >
              <Text style={tw`text-center text-red-400`}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={tw`w-60 h-60 rounded-lg mt-4`}
          resizeMode="contain"
        />
      )}
    </View>
  );
};


export const Ferramentas: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [recentEdits,setRecentEdits] = useState<Images[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const loadRecentImages = await RecentProcessedImages();
      setRecentEdits(loadRecentImages);
    };
  
    fetchImages();
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-slate-900`} contentContainerStyle={tw`pb-10`}>
      <View style={tw`bg-slate-800 flex-row justify-between items-center py-3 px-4`}>
        <View style={tw`flex-row items-center`}>
          <Image source={require("../../assets/iconArtify.png")} style={tw`w-10 h-10 mr-2`} />
          <Text style={tw`text-white text-lg font-bold`}>Artify</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/*Edições recentes*/ }
      
        <View style={tw`px-4 mt-6`}>
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
                          : require("../../assets/icon.png")
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

      {toolSections.map((section) => (
        <Section key={section.title} title={section.title} data={section.data} />
      ))}

      <View style={tw`mt-8 py-4 border-t border-gray-700 px-4 items-center`}>
        <Text style={tw`text-white text-lg font-semibold mb-2`}>Redes sociais</Text>
        <View style={tw`flex-row justify-around w-full max-w-xs`}>
          {["facebook", "instagram", "twitter", "globe"].map((icon) => (
            <Icon key={icon} name={icon} size={20} color="#fff" />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};