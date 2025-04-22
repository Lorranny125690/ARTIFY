import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { userLoginBody } from "../../types/interfaces/UserLoginInterface";
import { Axios } from "../../scripts/axios";
import { AuthUser } from "../../scripts/authHandler/authenticatedUser";




export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const authenticationController = new AuthUser()
  const [Params,SetParams] = useState<userLoginBody>({
    Email:"",Password:""
  })

  //Função para fazer o POST da requisição de um novo usuário
  const handlePost = async ()=>{
    Axios.post("/user/login",Params)
    .then((res)=>{
      switch(res.status){
        case 200: 
          alert("Loggado com sucesso");
          authenticationController.StoreUserToken(res.data.userId)
          navigation.navigate("Home")
          break;
        case 404: alert("Email não encontrado"); break;
        case 500: alert("Erro desconhecido"); break;
        default: alert("Nem Deus sabe oq aconteceu aqui")
      }
    })
    .catch((err)=>{
      console.error(err)
    })
  }


  return (
    <View style={tw`flex-1 bg-slate-900 items-center px-6`}>
      
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
        style={tw`w-110 h-110`} 
        resizeMode="contain"
      />

      {/* Input de Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
        onChangeText={(text) => SetParams(prev=>({...prev, Email:text}))}
      />

      {/* Input de Senha */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-4 p-3 rounded-lg text-white`}
        onChangeText={(text) => SetParams(prev=>({...prev, Password:text}))}
      />

      {/* Esqueceu a senha */}
      <TouchableOpacity onPress={() => navigation.navigate("Email")}>
        <Text style={tw`text-gray-300 mb-12`}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity
        style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
        onPress={async()=> await handlePost()}
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
    </View>
  );
};





