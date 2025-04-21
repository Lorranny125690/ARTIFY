import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "twrnc";
import { Axios } from "../scripts/axios";
import { AuthUser } from "../scripts/authHandler/authenticatedUser";
import { RootStackParamList } from "../types/rootStackParamList";



export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const authManager = new AuthUser()
  //Redirecionar para o Home se já estiver logado
  const checkUserToken = async () => {
    const token = await authManager.GetUserToken();
      if (token.id!=null) {
        console.log(token.id)
        await Axios.get("/user",{
          headers:{'Authorization': `Bearer ${token.id}`}
        })
        .then(async res=>{
            if(res.status==200){
                await authManager.storeUserInfo(res.data.name)
            }else{
                throw new Error("Usuário não encontrado; o Token fornecido está errado")
            }
        })
        .catch(err=>{
            console.error(err)
            throw new Error("Erro desconhecido")
        })
        navigation.replace("Home"); 
      }
  };
  //Checa se o usuárioja 
  useEffect(() => {
    checkUserToken(); 
  }, []);
  
  return (
    <View style={tw`flex-1 bg-slate-900 items-center justify-center`}>
      {/* Imagem do Logo */}
      <View style={tw`mb-20`}>
        <Image 
          source={require("../assets/iconArtify.png")} 
          style={tw`w-100 h-100`} 
          resizeMode="contain"
        />
      </View>

      {/* Botão Cadastrar-se */}
      <TouchableOpacity 
        style={tw`bg-gray-800 py-2 px-10 rounded-lg mb-4 w-4/5 items-center`}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Cadastrar-se</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity 
        style={tw`bg-gray-800 py-2 px-10 rounded-lg mb-4 w-4/5 items-center`}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
      </TouchableOpacity>

      {/* Link "Entrar sem uma conta" */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={tw`text-gray-400 mt-6 underline`}>Entrar sem uma conta</Text>
      </TouchableOpacity>
    </View>
  );
};
