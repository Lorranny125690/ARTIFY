// src/screens/LoginScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import Login from "./Services/Login";
import { CustomModal } from "./Modal";

export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin, onRegister } = useAuth();
  const [pressed, setPressed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const login = async () => {
    setPressed(true);
  
    if (!email || !password) {
      setModalMsg("Preencha todos os campos.");
      setModalVisible(true);
      return;
    }
  
    const result = await onLogin!(email, password);
  
    if (!result || result.error) {
      setModalMsg("Algo deu errado. Tente novamente.");
      setModalVisible(true);
      return;
    }
  
    const status = result.data?.statusCode;
  
    if (status === 200) {
      return;
    }
  
    if (status === 404) {
      setModalMsg("Email não encontrado.");
    } else if (status === 500) {
      setModalMsg("Erro desconhecido.");
    } else {
      setModalMsg("Email ou senha errados 😯! Digite novamente.");
    }
  
    setModalVisible(true);
  };  

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center p-4`}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={tw`absolute top-12 left-4 z-50`}
      >
        <ArrowLeft color="white" size={28} />
      </TouchableOpacity>
  
      <Image
        source={require("../../assets/Logo.png")}
        style={tw`w-90 h-90 m-10`}
        resizeMode="contain"
      />
  
      <View style={tw`w-full max-w-[300px] mb-8`}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={(text: string) => setEmail(text)}
          value={email}
        />
        {!email && pressed && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>
  
      <View style={tw`w-full max-w-[300px] mb-4`}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
        />
        {!password && pressed && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>
  
      <TouchableOpacity onPress={() => navigation.navigate("Email")}>
        <Text style={tw`text-gray-300 mb-12`}>Esqueceu a senha?</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={tw`bg-slate-800 rounded-4 px-18 py-2 items-center mb-4`}
        onPress={login}
      >
        <Text style={tw`text-white text-sl font-semibold`}>Login</Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMsg}
      />
  
      <View style={tw`flex-row`}>
        <Text style={tw`text-white`}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={tw`text-sky-400 underline`}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}