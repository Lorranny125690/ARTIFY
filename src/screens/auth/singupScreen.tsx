import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import { EmailPostInterface } from "../../types/interfaces/UserPostInterface";
import { Axios } from "../../scripts/axios";



export const SignupScreen = () => {
    const [requestBody,setRequestBody] = useState<EmailPostInterface>({
      Email:"",Password:"",userName:""
    })
  
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    
    //Faz o post do usuário após o fim da requisição
    const postCase = async()=>{
      alert("Cadastrando")
      await Axios.post("/auth",requestBody)
      .then((res)=>{
        console.log(res)
        if(res.status==201){
          alert("Usuário Cadastrado 🎊")
        }
      }).catch(err=>{ 
        console.error(err); // melhor para debugar
        alert("Erro desconhecido");
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
        
        <Image
          source={require("../../assets/iconArtify.png")}
          style={tw`w-110 h-110`} 
          resizeMode="contain"
        />
              
        {/* Inputs */}
        <TextInput 
          placeholder="Nome de usuário"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text) => setRequestBody(prev=>({...prev, userName:text}))}
        />
        <TextInput 
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text) => setRequestBody(prev=>({...prev, Email:text}))}
        />
        <TextInput 
          placeholder="Senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
          onChangeText={(text) => setRequestBody(prev=>({...prev, Password:text}))}
        />
        <TextInput 
          placeholder="Confirmar senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
        />
        
        {/* Botão Cadastrar */}
        <TouchableOpacity style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
          onPress={async ()=> await postCase()}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Cadastrar</Text>
        </TouchableOpacity>
        
        {/* Link para Login */}
        <Text style={tw`text-gray-400`}>Já tem uma conta?
          <Text 
            style={tw`text-blue-400 underline`} 
            onPress={() => navigation.navigate("Login")}>
            Entrar
          </Text>
        </Text>
      </View>
    );
  };