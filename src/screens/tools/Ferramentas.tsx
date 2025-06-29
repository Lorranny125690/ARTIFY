import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
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
import { Images } from "../../types/entitys/images";
import { Camera } from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import Axios from "../../scripts/axios";
import { useImagesContext, type ImageType } from "../../contexts/ImageContext/imageContext";

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
    title: "Especiais",
    data: [
      { name: "Remove Background", icon: "scissors" },
      { name: "Pixelização facial", icon: "th-large" },
      { name: "Pixelização Total", icon: "th" },
      { name: "Blur", icon: "eye-slash" },
      { name: "Remover Background em Vídeo", icon: "video-camera" },
      { name: "Detecção de Rostos com IA", icon: "user-circle" },
    ],
  },
];

const transformacoesSection: { title: string; data: Item[] } = {
  title: "Transformações",
  data: [
    { name: "Resize", icon: "expand" },
    { name: "Rotação", icon: "repeat" },
    { name: "Translação (warpAffine)", icon: "arrows" },
    { name: "Escala (Cardinal)", icon: "arrows-alt" },
    { name: "Flip X", icon: "exchange" },
    { name: "Cropping", icon: "crop" },
  ],
};

const detecaoRealceSection: { title: string; data: Item[] } = {
  title: "Detecção e Realce",
  data: [
    { name: "Color Enhancer", icon: "magic" },
    { name: "Chromatic Aberration", icon: "eye" },
  ],
};

const Section: React.FC<{ title: string; data: Item[] }> = ({ title, data }) => {
  const { authState } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const token = authState?.token;
  const { uploadImage, images, selectedFilter, setSelectedFilter, getProcessamentoPorId } = useImagesContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Item>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onToolPress = (tool: Item) => {
    setSelectedTool(tool);
    setSelectedFilter(tool.name);
    setModalVisible(true);
    setImageUri(null);
  };  

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTool(undefined);
  };

  const handleUploadAndFilter = async (imageUri: string, selectedFilter: string) => {
    if (!selectedFilter) {
      Alert.alert("Erro", "Selecione um filtro antes.");
      return;
    }
  
    const uploadedImage = await uploadImage(imageUri, selectedFilter);
  
    if (!uploadedImage || !uploadedImage.Id) {
      Alert.alert("Erro", "Falha ao enviar imagem.");
      return;
    }
  };   

  return (
    <View style={tw`mt-6 px-4`}>
      <Text style={tw`text-white text-lg font-semibold mb-2`}>
        {title}
      </Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onToolPress(item)}
            style={tw.style(
              "bg-slate-700 w-28 h-28 p-3 rounded-lg items-center justify-center mx-2",
              selectedTool?.name === item.name && "border-2 border-cyan-400"
            )}
          >
            <Icon name={item.icon} size={24} color="#fff" />
            <Text style={tw`text-white text-xs mt-2 text-center`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={tw`mt-2`}
        showsHorizontalScrollIndicator={false}
      />

      {/* Modal de seleção */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}
          activeOpacity={1}
          onPressOut={handleCloseModal}
        >
          <View style={tw`bg-slate-800 w-72 p-6 rounded-2xl shadow-lg`}>
            <Text style={tw`text-white text-lg font-semibold text-center mb-6`}>
              Como deseja abrir a imagem?
            </Text>

            <View style={tw`flex-row justify-around mb-4`}>
              <TouchableOpacity
                onPress={async () => {
                  const uri = await openCamera();
                  if (uri) {
                    await handleUploadAndFilter(uri, String(selectedFilter));
                    setModalVisible(false);
                  }
                }}                
                style={tw`bg-sky-500 px-4 py-3 rounded-lg items-center`}
              >
                <Icon name="camera" size={30} color="#fff" />
                <Text style={tw`text-white font-semibold mt-1`}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const uri = await openGallery();
                  if (uri) {
                    await handleUploadAndFilter(uri, String(selectedFilter));
                    setModalVisible(false);
                  }
                }}
                style={tw`bg-teal-500 px-4 py-3 rounded-lg items-center`}
              >
                <Icon name="image" size={30} color="#fff" />
                <Text style={tw`text-white font-semibold mt-1`}>Galeria</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={tw`text-center text-red-400 text-sm`}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const Ferramentas: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [recentEdits, setRecentEdits] = useState<Images[]>([]);
  const { authState } = useAuth();

  const token = authState?.token;

  useEffect(() => {
    const fetchImages = async () => {
      const loadRecentImages = await RecentProcessedImages(token);
      setRecentEdits(loadRecentImages);
    };
    fetchImages();
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-slate-900`} contentContainerStyle={tw`pb-10`}>
      <View style={tw`bg-slate-800 flex-row justify-between items-center py-3 px-4`}>
        <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={tw`px-4 mt-6`}>
        <Text style={tw`text-white text-lg font-semibold mb-2`}>
          Usadas recentemente
        </Text>
        {recentEdits.length > 0 ? (
          <FlatList
            horizontal
            data={recentEdits}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={tw`bg-slate-700 m-2 p-4 rounded-lg w-29 mx-2 items-center shadow-lg`}>
                <Image
                  source={
                    item.public_url
                      ? { uri: item.public_url }
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

      <Section
        key={detecaoRealceSection.title}
        title={detecaoRealceSection.title}
        data={detecaoRealceSection.data}
      />

      <Section
        key={transformacoesSection.title}
        title={transformacoesSection.title}
        data={transformacoesSection.data}
      />

      <View style={tw`mt-8 py-4 gap-10 bg-slate-800 items-center justify-center top-10`}>
        <View style={tw`flex-row top-2 items-center`}>
          <Text style={tw`text-white mr-30 text-xl font-semibold mb-2`}>Redes sociais</Text>
          <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
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
