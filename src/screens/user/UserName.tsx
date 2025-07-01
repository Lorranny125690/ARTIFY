import React, { useState, useEffect } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/rootStackParamList';
import Axios from '../../scripts/axios';
import { useAuth } from '../../contexts/AuthContext/authenticatedUser';

export const UserName = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState } = useAuth();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [userName, setUserName] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(false); 

  const token = authState?.token;

  useEffect(() => {
    if (currentPassword.length >= 6 && currentPassword.trim().length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [currentPassword, newName]);  

  const myUser = async () => {
    try {
      const token = authState?.token
      
      const result = await Axios.get(`/user`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(result.data);
      
      const username = result.data.user.name;
      const email = result.data.user.email;

      setEmail(email)
      setUserName(username)
    } catch (e: any) {
      console.warn("Erro ao buscar usuário:", e?.response?.data?.msg || e.message);
  };}

  useEffect(() => {
    if (authState?.authenticated) {
      myUser();
    }
  }, [authState]);  

  const handleUpdateName = async () => {
    console.log('Dados para update:', { email, newName, currentPassword });
    
    try {
      const response = await Axios.put(
        '/user',
        {
          email: email,
          name: newName,
          password: currentPassword,
          role: 'User',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );      

      if (response.status === 200) {
        alert('Nome atualizado com sucesso!');
        navigation.goBack();
      } else {
        alert('Erro ao atualizar o nome.');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert('Usuário não encontrado.');
      } else {
        alert('Erro ao atualizar. Verifique sua senha.');
      }
      console.error(error);
    }
  };   

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-[#0F172A] p-5`}>
      <Animatable.View animation="fadeInUp" duration={600} style={tw`mt-10`}>
        {/* Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`flex-row items-center mb-6`}>
          <ArrowLeft color="white" size={24} />
          <Text style={tw`text-white text-xl ml-3 font-semibold`}>
            Alterar nome de usuário
          </Text>
        </TouchableOpacity>

        {/* Usuário */}
        <View style={tw`flex-row items-center mb-8`}>
          <View style={tw`w-12 h-12 rounded-full bg-white/10 items-center justify-center`}>
            <Text style={tw`text-white text-lg`}>T</Text>
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-white text-base font-bold`}>{ userName || 'Usuário'}</Text>
            <Text style={tw`text-gray-400 text-sm`}>Usuário ativo</Text>
          </View>
        </View>

        {/* Novo nome */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-white mb-2`}>Insira seu novo nome</Text>
          <TextInput
            placeholder="Digite seu novo nome"
            placeholderTextColor="#94A3B8"
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
            value={newName}
            onChangeText={setNewName}
          />
        </View>

        {/* Senha atual */}
        <View style={tw`mb-10`}>
          <Text style={tw`text-white mb-2`}>Confirme sua senha</Text>
          <TextInput
            placeholder="Digite sua senha atual"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Text style={tw`text-xs text-gray-400 mt-1`}>
            A senha é necessária para confirmar a alteração.
          </Text>
        </View>

        {/* Botões */}
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`flex-1 mr-2 bg-white rounded-xl py-3`}
          >
            <Text style={tw`text-center text-[#0F172A] font-semibold`}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isValid}
            onPress={handleUpdateName}
            style={[
              tw`flex-1 ml-2 rounded-xl py-3`,
              isValid ? tw`bg-gray-700` : tw`bg-gray-500 opacity-50`,
            ]}
          >
            <Text style={tw`text-center text-white font-semibold`}>
              Salvar alterações
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};
