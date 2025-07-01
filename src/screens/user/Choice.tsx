import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/rootStackParamList';
import { ArrowRight } from 'lucide-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const AccountOptions = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-[#0F172A] p-5`}>

      <TouchableOpacity 
      onPress={() => navigation.goBack()}
      accessibilityLabel="Voltar"
      style={tw`mb-6 justify-content items-center gap-2 left-1.5 flex-row`}>
        <AntDesign name="left" size={24} color="#fff" />
        <Text style={tw`text-white text-lg font-bold`}>Perfil de Usuário</Text>
      </TouchableOpacity>

      <Animatable.View animation="fadeInUp" duration={500}>
        <Text style={tw`text-white text-2xl font-bold mb-8`}>Conta</Text>

        {/* Opção: Alterar Nome de Usuário */}
        <TouchableOpacity
          style={tw`bg-white/5 p-4 rounded-xl mb-4 flex-row justify-between items-center`}
          onPress={() => navigation.navigate("userName")}
        >
          <Text style={tw`text-white text-base`}>Alterar nome de usuário</Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>

        {/* Opção: Alterar Senha */}
        <TouchableOpacity
          style={tw`bg-white/5 p-4 rounded-xl flex-row justify-between items-center`}
          onPress={() => navigation.navigate("Password")}
        >
          <Text style={tw`text-white text-base`}>Alterar senha</Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
};
