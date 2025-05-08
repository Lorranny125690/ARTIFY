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
import { API_URL, useAuth } from "../../scripts/AuthContext/authenticatedUser";
import { loginService } from "./Login";

export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin, onRegister } = useAuth();

  useEffect(() => {
    loginService(); // ⬅️ chamada separada
  }, []);

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

      <TextInput
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
        onChangeText={(text: string) => setEmail(text)}
        value={email}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-4 p-3 rounded-lg text-white`}
        onChangeText={(text: string) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Email")}>
        <Text style={tw`text-gray-300 mb-12`}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
        onPress={login}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
      </TouchableOpacity>

      <View style={tw`flex-row`}>
        <Text style={tw`text-white`}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={tw`text-sky-400 underline`}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};