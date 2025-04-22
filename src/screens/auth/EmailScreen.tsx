import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";

export const EmailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-slate-900 items-center px-6`}> 
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={tw`absolute top-12 left-6 z-50`}>
        <Text style={tw`text-white text-2xl`}>{"←"}</Text>
      </TouchableOpacity>
      
      <Image
        source={require("../../assets/iconArtify.png")}
        style={tw`w-110 h-110`} 
        resizeMode="contain"
      />   

      <Text style={tw`text-white text-xl font-semibold text-center mb-2`}>
          Esqueceu a senha?
        </Text>
        <Text style={tw`text-slate-300 text-center mb-8`}>
          Redefina a senha em duas etapas
      </Text>
      
      {/* Inputs */}
      <TextInput 
        placeholder="Digite seu e-mail"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-gray-800 w-full p-2 mb-4 rounded-lg text-white`}
      />

      {/* Botão Cadastrar */}
      <TouchableOpacity onPress={ () => navigation.navigate("Recuperação")}style={tw`bg-gray-700 py-3 px-6 rounded-lg w-full items-center mb-4`}>
        <Text style={tw`text-white text-lg font-semibold`}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};