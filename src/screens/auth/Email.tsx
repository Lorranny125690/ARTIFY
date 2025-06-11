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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-12 left-4 z-50`}
      >
        <ArrowLeft color="white" size={28} />
      </TouchableOpacity>
      
      <Image
        source={require("../../assets/Logo.png")}
        style={tw`w-90 h-90`} 
        resizeMode="contain"
      />   

      <Text style={tw`text-white text-xl font-semibold text-center mb-2`}>
          Esqueceu a senha?
        </Text>
        <Text style={tw`text-slate-300 text-center mb-18`}>
          Redefina a senha em duas etapas
      </Text>
      
      {/* Inputs */}
      <View style={tw`gap-5 mb-8`}>
        <Text style={tw` text-white text-sl font-semibold mb-2`}>
        Qual seu e-mail de cadastro?
      </Text>
      <TextInput 
        placeholder="Digite seu e-mail"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 p-3 w-80 rounded-lg text-white`}
      />
      </View>
      <TouchableOpacity onPress={ () => navigation.navigate("Recuperação")}style={tw`bg-slate-800 rounded-4 px-15 py-2 items-center mb-4`}>
          <Text style={tw`text-center text-white text-sl font-semibold`}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};