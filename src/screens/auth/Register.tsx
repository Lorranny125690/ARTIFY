import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import { CustomModal } from "./Modal";

export const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [Email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { onLogin, onRegister } = useAuth();
  const [pressed, setPressed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const login = async () => {
    const result = await onLogin!(Email, Password);
    if (result.e) {
      alert(result.msg);
    }
  };

  const register = async () => {
    setPressed(true);

    if (Password !== confirmPassword) {
      setModalMsg("As senhas não coincidem! Dá uma olhada aí 😯");
      setModalVisible(true);
      return;
    }

    const result = await onRegister!(Email, Password, userName);

    if (result?.statusCode === 409 || result?.error) {
      setModalMsg("Esse e-mail já está em uso! Tenta outro 😉");
      setModalVisible(true);
      return;
    }

    await login(); 
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center justify-center px-4`}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={tw`absolute top-12 left-4 z-50`}
      >
        <ArrowLeft color="white" size={28} />
      </TouchableOpacity>

      <Image
        source={require("../../assets/iconArtify.png")}
        style={tw`w-80 h-80`} 
        resizeMode="contain"
      />

      {/* Nome de usuário */}
      <View style={tw`w-full max-w-[300px] mb-8`}>
        <TextInput 
          placeholder="Nome de usuário"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setUserName}
          value={userName}
        />
        {pressed && !userName && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>

      {/* Email */}
      <View style={tw`w-full max-w-[300px] mb-8`}>
        <TextInput 
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setEmail}
          value={Email}
        />
        {pressed && !Email && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>

      {/* Senha */}
      <View style={tw`w-full max-w-[300px] mb-8`}>
        <TextInput 
          placeholder="Senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setPassword}
          value={Password}
        />
        {pressed && !Password && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>

      {/* Confirmar Senha */}
      <View style={tw`w-full max-w-[300px] mb-8`}>
        <TextInput 
          placeholder="Confirmar senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {pressed && !confirmPassword && (
          <Text style={tw`text-red-500 mt-1`}>Esse campo é obrigatório</Text>
        )}
      </View>

      {/* Botão Cadastrar */}
      <TouchableOpacity 
        style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
        onPress={register}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Cadastrar</Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMsg}
      />

      {/* Link para Login */}
      <Text style={tw`text-gray-400`}>Já tem uma conta?</Text>
      <Text 
        style={tw`text-blue-400 underline`} 
        onPress={() => navigation.navigate("Login")}
      >
        Entrar
      </Text>
    </ScrollView>
  );
};
