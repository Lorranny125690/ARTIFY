import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { API_URL, useAuth } from "../../contexts/AuthContext/authenticatedUser";
import axios from "axios";

export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {onLogin, onRegister} = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.post(`${API_URL}/user/login`)
      console.log("File: Login text:16 ~testcall ~result: ", result)
    }

    testCall();
  }, [])

  const login = async () => {
    const result = await onLogin!(email, password);

    if (result.e) {
      alert(result.msg);
    }

    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
  };  

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center justify-center`}> 
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={tw`absolute top-12 left-4 z-50`}
      >
      <ArrowLeft color="white" size={28} />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../../assets/iconArtify.png")}
        style={tw`w-80 h-80`} 
        resizeMode="contain"
      />

      {/* Input de Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
        onChangeText={(text: string) => setEmail(text)} value={email}
      />

      {/* Input de Senha */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-4 p-3 rounded-lg text-white`}
        onChangeText={(text: string) => setPassword(text)} value={password}
      />

      {/* Esqueceu a senha */}
      <TouchableOpacity onPress={() => navigation.navigate("Email")}>
        <Text style={tw`text-gray-300 mb-12`}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity
        style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
        onPress={login}
      >
        <Text style={tw`text-white text-lg font-semibold`}
              
        >Login</Text>
      </TouchableOpacity>

      {/* Cadastro */}
      <View style={tw`flex-row`}>
        <Text style={tw`text-white`}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={tw`text-sky-400 underline`}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};




