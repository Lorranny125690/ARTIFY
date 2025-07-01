import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import * as Animatable from 'react-native-animatable';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigatorProps, type StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/rootStackParamList';

export const ChangePassword = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-[#0F172A] p-5`}>
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={tw`mt-10`}
      >
        {/* Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`flex-row items-center mb-6`}>
          <ArrowLeft color="white" size={24} />
          <Text style={tw`text-white text-xl ml-3 font-semibold`}>
            Alterar senha
          </Text>
        </TouchableOpacity>

        {/* Usuário */}
        <View style={tw`flex-row items-center mb-8`}>
          <View style={tw`w-12 h-12 rounded-full bg-white/10 items-center justify-center`}>
            <Text style={tw`text-white text-lg`}>T</Text>
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-white text-base font-bold`}>Thierrir Alencar</Text>
            <Text style={tw`text-gray-400 text-sm`}>Usuário ativo</Text>
          </View>
        </View>

        {/* Campos */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-white mb-2`}>Senha Atual</Text>
          <TextInput
            placeholder="Digite sua senha atual"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
          />
          <Text style={tw`text-xs text-gray-400 mt-1`}>
            A senha deve ter pelo menos 6 caracteres.
          </Text>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-white mb-2`}>Nova Senha</Text>
          <TextInput
            placeholder="Digite sua nova senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
          />
          <Text style={tw`text-xs text-gray-400 mt-1`}>
            A nova senha deve conter letras e números.
          </Text>
        </View>

        <View style={tw`mb-10`}>
          <Text style={tw`text-white mb-2`}>Confirme a Nova Senha</Text>
          <TextInput
            placeholder="Confirme sua nova senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
          />
          <Text style={tw`text-xs text-gray-400 mt-1`}>
            As senhas devem coincidir.
          </Text>
        </View>

        {/* Botões */}
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity style={tw`flex-1 mr-2 bg-white rounded-xl py-3`}>
            <Text style={tw`text-center text-[#0F172A] font-semibold`}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`flex-1 ml-2 bg-gray-700 rounded-xl py-3`}>
            <Text style={tw`text-center text-white font-semibold`}>
              Salvar alterações
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};