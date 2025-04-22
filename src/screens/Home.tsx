import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

type Item = {
  name: string;
  icon: string;
};

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Auth: undefined;
  SaveImages: undefined;
  Gallery: undefined;
  Ferramentas: undefined;
  Recuperação: undefined;
  Email: undefined;
  Camera: undefined;
};

const recentEdits = [
  require("../assets/splash-icon.png"),
  require("../assets/splash-icon.png"),
  require("../assets/splash-icon.png"),
];

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
  {
    title: "Outras Operações",
    data: [
      { name: "Filtro de Borda (Canny)", icon: "share-alt" },
      { name: "Blur Facial", icon: "eye-slash" },
      { name: "Pixelização facial", icon: "th-large" },
    ],
  },
];

const Section: React.FC<{ title: string; data: Item[] }> = ({ title, data }) => (
  <View style={tw`mt-6 px-2 items-center`}>
    <Text style={tw`text-white text-lg font-semibold self-start`}>{title}</Text>
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity style={tw`bg-slate-700 w-28 h-28 p-3 rounded-lg items-center justify-center mx-2`}>
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

  return (
    <ScrollView style={tw`flex-1 bg-slate-900`} contentContainerStyle={tw`pb-10`}>
      {/* Header */}
      <View style={tw`bg-slate-800 flex-row justify-between items-center py-2 px-4`}>
        <View style={tw`flex-row items-center`}>
          <Image source={require("../assets/iconArtify.png")} style={tw`w-15 h-15 mr-2`} />
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Edições recentes */}
      <View style={tw`px-4 mt-4 justify-between items-center`}>
        <Text style={tw`text-white text-lg font-semibold`}>Edições recentes</Text>
        <FlatList
          horizontal
          data={recentEdits}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Image source={item} style={tw`w-24 h-24 rounded-lg mx-2`} />}
          contentContainerStyle={tw`mt-2`}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Destaque */}
      <View style={tw`bg-slate-800 p-4 rounded-lg mt-6 mx-4`}>
        <Image source={require("../assets/nerd.jpg")} style={tw`w-full h-50 rounded-lg`} />
        <Text style={tw`text-white text-sm mt-2 text-center`}>
          Um Texto muito legal que Alex vai achar muito foda e que eu to testando aqui aumentando pra preencher espaço
        </Text>
      </View>

      {/* Ferramentas agrupadas */}
      {toolSections.map((section) => (
        <Section key={section.title} title={section.title} data={section.data} />
      ))}

      {/* Footer */}
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
