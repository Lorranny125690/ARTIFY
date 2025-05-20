import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";

export const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [Email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [Password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const {onLogin, onRegister} = useAuth();
  const [pressed,setPressed] = useState<boolean>(false)
  const login = async () => {
    const result =  await onLogin!(Email, Password);
    if (result.e) {
      alert(result.msg);
    }
  }

  const register = async () => {
    setPressed(true)
    if (Password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    const result = await onRegister!(Email, Password, userName);
  
    await login(); 
  };

  function validar() {
    if (!Email) {
      <Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>
    }
    else if (!Password) {
      <Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>
    } else if (!userName) {
      <Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>
    }
  }

    return (
      <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center justify-center`}> 
        {/* Botão de Voltar */}
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
              
        {/* Inputs */}
        <TextInput 
          placeholder="Nome de usuário"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text: string) => setUserName(text)} value={userName}
        />
        {!userName && pressed?<></>:<Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>}

        <TextInput 
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text: string) => setEmail(text)} value={Email}
        />
        {!Email && pressed?<></>:<Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>}

        <TextInput 
          placeholder="Senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text: string) => setPassword(text)} value={Password}
        />
        {!Password && pressed?<></>:<Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>}

        <TextInput 
        placeholder="Confirmar senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
        onChangeText={(text: string) => setConfirmPassword(text)} value={confirmPassword}
        />
        {!confirmPassword && pressed?<></>:<Text style={tw`text-red-500 mb-1`}>Esse campo é obrigatório</Text>}
  
        {/* Botão Cadastrar */}
        <TouchableOpacity style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
          onPress={register}
          
        >
          <Text style={tw`text-white text-lg font-semibold`}>Cadastrar</Text>
        </TouchableOpacity>
        
        {/* Link para Login */}
        <Text style={tw`text-gray-400`}>Já tem uma conta?</Text>
        <Text 
            style={tw`text-blue-400 underline`} 
            onPress={() => navigation.navigate("Login")}>
            Entrar
          </Text>
      </ScrollView>
    );
  };