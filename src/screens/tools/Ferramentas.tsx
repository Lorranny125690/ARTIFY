import React, { useContext, useEffect, useState } from "react";
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
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/rootStackParamList";
import { openCamera } from "./functions/OpenCamera";
import { openGallery } from "./functions/OpenGallery";
import { API_URL, useAuth } from "../../contexts/AuthContext/authenticatedUser";
import { useImagesContext } from "../../contexts/ImageContext/imageContext";

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
    title: "Modificação de imagem",
    data: [
      { name: "Remove Background", icon: "scissors" },
      { name: "Pixelização Total", icon: "th" },
      { name: "Comprimir Imagens", icon: "expand" },
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
    { name: "Blur", icon: "eye-slash" },
    { name: "Pixelização facial", icon: "th-large" },
    { name: "Detecção de Rostos com IA", icon: "user-circle" },
  ],
};

const GenerativeAiSection: { title: string; data: Item[] } = {
  title: "Inteligência Artificial",
  data: [
    { name: "Gerar Imagens", icon: "magic" },
  ],
};
const Section: React.FC<{ title: string; data: Item[] }> = ({ title, data }) => {
  const { authState } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const token = authState?.token;
  const { uploadImage, images, selectedFilter, setSelectedFilter ,GenerateImage} = useImagesContext();
  const [inputModalVisible,setInputModalVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Item>();
  const [toolSelectionActive, setToolSelectionActive] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [promptInput,setPromptInput] = useState<string>("")

  const onToolPress = (tool: Item) => {
    console.log(tool)
    if(tool.name!="Gerar Imagens"){
      setSelectedTool(tool);
      setSelectedFilter(tool.name);
      setModalVisible(true);
      setToolSelectionActive(true)
    }else{
      setSelectedTool(tool);
      setSelectedFilter(tool.name);
      setModalVisible(false);
      setInputModalVisible(true);
      setToolSelectionActive(true)
    }
  };

  const onAifunctionCalled = async ()=>{
      GenerateImage(promptInput)
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    setToolSelectionActive(false)
    setInputModalVisible(false)
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalVisible(false)
    setToolSelectionActive(false)
  };

  const onPickImage = async (pickFunc: () => Promise<string[]>) => {
    const uris = await pickFunc();
    if (uris.length > 0) {
      setImageUris(uris);
      setModalVisible(false);
      setConfirmModalVisible(true);
    }
  };  

  const handleConfirmUpload = async () => {
    if (!selectedFilter) {
      Alert.alert("Erro", "Selecione um filtro antes.");
      return;
    }
    if (imageUris.length === 0) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }
  
    setLoading(true);
    try {
      const result = await uploadImage(imageUris, selectedFilter);
      if (!result || !result.Ids || result.Ids.length === 0) {
        Alert.alert("Erro", "Falha ao enviar imagens.");
        return;
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar imagens.");
    } finally {
      setLoading(false);
      setConfirmModalVisible(false);
      setToolSelectionActive(false);
      setImageUris([]);
    }
  };  

  function onSubmitImageUrl(imageUrl: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={tw`mt-6 px-4 mb-15`}>
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
              title === "Inteligencia Artificial" ? "w-95 bg-slate-700 h-30 p-4":
              title === "Modificação de imagem"
                ? "bg-slate-700 w-40 h-30 p-4"
                : "bg-slate-700 w-28 h-28 p-3",
              "rounded-lg items-center justify-center mr-3",
              toolSelectionActive && selectedTool?.name === item.name && "border-2 border-cyan-400"
            )}
          >
            <Icon name={item.icon} size={title === "Modificação de imagem" ? 28 : 24} color="#fff" 
                style={tw.style(
                  
                )}
            />
            <Text
              style={tw.style(
                title === "Modificação de imagem" ? "text-white text-sm mt-3 text-center" : "text-white text-xs mt-2 text-center",
               
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        
        contentContainerStyle={tw`mt-2`}
        showsHorizontalScrollIndicator={false}
      />

      {/* Modal para escolher câmera ou galeria */}
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
                onPress={() => onPickImage(openCamera)}
                style={tw`bg-sky-500 px-4 py-3 rounded-lg items-center`}
              >
                <Icon name="camera" size={30} color="#fff" />
                <Text style={tw`text-white font-semibold mt-1`}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onPickImage(openGallery)}
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

      {/* Modal para input em funções de IA*/ }

      <Modal visible={inputModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}
          activeOpacity={1}
          onPressOut={handleCloseModal}
        >
          <View style={tw`bg-slate-800 w-72 p-6 rounded-2xl shadow-lg`}>
            <Text style={tw`text-white text-lg font-semibold text-center mb-4`}>
              Imagine Uma imagem
            </Text>

            <TextInput
              value={promptInput} // valor atual do input
              onChangeText={(e) => setPromptInput(e)} // função chamada quando o texto mudar
              placeholderTextColor="#94a3b8"
              style={tw`bg-slate-700 text-white p-3 rounded-lg mb-4`}
            />

            <TouchableOpacity
              onPress={() => {
                onAifunctionCalled();
                handleCloseModal();
              }}
              style={tw`bg-sky-500 py-3 rounded-lg items-center mb-3`}
            >
              <Text style={tw`text-white font-semibold`}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={tw`text-center text-red-400 text-sm`}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de confirmação da imagem */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={tw`flex-1 bg-black bg-opacity-70 justify-center items-center px-6`}>
          <View style={tw`bg-slate-900 rounded-2xl p-4 w-full max-w-xs`}>
            <Text style={tw`text-white text-lg text-center mb-4`}>Confirmar imagem?</Text>

            <ScrollView contentContainerStyle={tw`justify-center items-center p-4`}horizontal>
              {imageUris.map((uri, index) => (
                <Image key={index} source={{ uri }} style={tw`left-5 w-50 h-50 m-2`} />
              ))}
            </ScrollView>
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                onPress={handleCloseConfirmModal}
                style={tw`flex-1 bg-indigo-600 px-4 py-3 rounded-lg mr-2`}
              >
                <Text style={tw`text-white text-center font-semibold`}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmUpload}
                style={tw`flex-1 bg-sky-600 px-4 py-3 rounded-lg ml-2`}
                disabled={loading}
              >
<View style={tw`flex-row justify-center items-center`}>
  {loading && (
    <ActivityIndicator
      size="small"
      color="#ffffff"
      style={tw`mr-2`}
    />
  )}
  <Text style={tw`text-white text-center font-semibold`}>
    {loading ? "Enviando..." : "Confirmar"}
  </Text>
</View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

type ImageType = {
  type: number;
  id: string;
  uri: string;
  filename: string;
  nome: string;
  dataFormatada: string;
  favorite: boolean;
};

export const Ferramentas: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { authState } = useAuth();
  const [recentEdits, setRecentEdits] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = authState?.token;

  return (
    <ScrollView style={tw`flex-1 bg-slate-900`} contentContainerStyle={tw`pb-10`}>
      {/* Topo */}
      <View style={tw`bg-slate-800 flex-row justify-between items-center py-3 px-4`}>
        <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Ferramentas */}
      {[...toolSections, detecaoRealceSection, transformacoesSection].map((section) => (
        <Section key={section.title} title={section.title} data={section.data} />
      ))}
      <Section key={"Inteligencia Artificial"} title="Inteligencia Artificial" data={[{ name: "Gerar Imagens", icon: "eye"}]}></Section>

      {/* Rodapé com redes sociais */}
      <View style={tw`bottom-0 top-10 py-6 bg-slate-800 items-center`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Text style={tw`text-white text-xl font-semibold mr-4`}>Redes sociais</Text>
          <Image source={require("../../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        </View>
        <View style={tw`flex-row justify-around w-full max-w-xs`}>
          {["facebook", "github", "envelope", "instagram", "twitter"].map((icon) => (
            <TouchableOpacity key={icon} style={tw`mx-2`}>
              <Icon name={icon} size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

