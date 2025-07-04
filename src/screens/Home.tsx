import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import { API_URL, useAuth } from "../contexts/AuthContext/authenticatedUser";
import Axios from "../scripts/axios";
import * as Animatable from "react-native-animatable";
import { useImagesContext, type ImageType } from "../contexts/ImageContext/imageContext";
import { openCamera } from "./tools/functions/OpenCamera";
import { openGallery } from "./tools/functions/OpenGallery";

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


export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { authState } = useAuth();
  const token = authState?.token;

  const [recentEdits, setRecentEdits] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Item>();
  const [toolSelectionActive, setToolSelectionActive] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { selectedFilter, setSelectedFilter, uploadImage } = useImagesContext();

  const onToolPress = (tool: Item) => {
    setSelectedTool(tool);
    setSelectedFilter(tool.name);
    setModalVisible(true);
    setToolSelectionActive(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setToolSelectionActive(false);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalVisible(false);
    setToolSelectionActive(false);
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

    setUploading(true);
    try {
      const result = await uploadImage(imageUris, selectedFilter);
      if (!result || !result.Ids || result.Ids.length === 0) {
        Alert.alert("Erro", "Falha ao enviar imagens.");
        return;
      }
      Alert.alert("Sucesso", "Imagens enviadas com sucesso!");
      history(); // atualiza edições recentes
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar imagens.");
    } finally {
      setUploading(false);
      setConfirmModalVisible(false);
      setToolSelectionActive(false);
      setImageUris([]);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      if (authState?.authenticated) {
        history();
      }
    }, [authState])
  );

return (
  <View style={tw`flex-1 bg-slate-900`}>
    <View style={tw`mb-2 bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
      <Image source={require("../assets/iconArtify.png")} style={tw`w-20 h-9`} />
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="bars" size={24} color="#fff" />
      </TouchableOpacity>
    </View>

    <View style={tw`flex-1 justify-between`}>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Edições recentes */}
        <View style={tw`px-4 mt-6`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Usadas recentemente</Text>
          {recentEdits.length > 0 ? (
            <FlatList
              horizontal
              data={recentEdits}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View style={tw`w-28 h-35 mx-2`}>
                  <Animatable.View
                    animation="fadeInUp"
                    delay={index * 100}
                    duration={400}
                    useNativeDriver
                  >
                    <TouchableOpacity onPress={() => navigation.navigate("Photo", { imageId: item.id })}>
                      <Image source={{ uri: item.uri }} style={tw`w-28 h-35 rounded-lg`} resizeMode="cover" />
                    </TouchableOpacity>
                  </Animatable.View>
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

        {/* Ferramentas agrupadas */}
        {toolSections.map((section) => (
          <View key={section.title} style={tw`mt-10 px-2`}>
            <Text style={tw`text-white text-lg left-5 font-semibold mb-3`}>{section.title}</Text>
            <FlatList
              horizontal
              data={section.data}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onToolPress(item)}
                  style={tw.style(
                    "bg-slate-700 left-4 w-28 h-28 p-3 rounded-lg items-center justify-center mx-2",
                    toolSelectionActive && selectedTool?.name === item.name && "border-2 border-cyan-400"
                  )}
                >
                  <Icon name={item.icon} size={24} color="#fff" />
                  <Text style={tw`text-white text-xs mt-2 text-center`}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))}
      </ScrollView>

      {/* Footer sempre no fim da tela */}
      <View style={tw`py-6 gap-10 bg-slate-800 items-center justify-center`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-white mr-30 text-xl font-semibold mb-2`}>Redes sociais</Text>
          <Image source={require("../assets/iconArtify.png")} style={tw`w-20 h-9`} />
        </View>
        <View style={tw`gap-10 flex-row justify-around w-full max-w-xs`}>
        {[
            { icon: "facebook", url: "https://www.facebook.com/seuPerfil" },
            { icon: "github", url: "https://github.com/Lorranny125690/ARTIFY" },
            { icon: "envelope", url: "mailto:lorrannyyasmin6@gmail.com" },
            { icon: "instagram", url: "https://www.instagram.com/lorrapaz?igsh=MXg5ejA5cjRnZXh3Yw==" },
            { icon: "twitter", url: "https://x.com/Lorr827271?t=4ROfdaddii4QZKtmUcAibA&s=09" },
          ].map(({ icon, url }) => (
            <TouchableOpacity key={icon} onPress={() => Linking.openURL(url)}>
              <Icon name={icon} size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </View>
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

      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={tw`flex-1 bg-black bg-opacity-70 justify-center items-center px-6`}>
          <View style={tw`bg-slate-900 rounded-2xl p-4 w-full max-w-xs`}>
            <Text style={tw`text-white text-lg text-center mb-4`}>Confirmar imagem?</Text>
            <ScrollView horizontal contentContainerStyle={tw`items-center justify-center`}>
              {imageUris.map((uri, index) => (
                <Image key={index} source={{ uri }} style={tw`left-5 w-50 h-50 m-2`} />
              ))}
            </ScrollView>
            <View style={tw`flex-row justify-between mt-4`}>
              <TouchableOpacity
                onPress={handleCloseConfirmModal}
                style={tw`flex-1 bg-indigo-600 px-4 py-3 rounded-lg mr-2`}
              >
                <Text style={tw`text-white text-center font-semibold`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmUpload}
                style={tw`flex-1 bg-sky-600 px-4 py-3 rounded-lg ml-2`}
                disabled={uploading}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  {uploading ? "Enviando..." : "Confirmar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
)};

