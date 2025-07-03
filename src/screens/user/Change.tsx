import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import tw from 'twrnc';
import * as Animatable from 'react-native-animatable';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/rootStackParamList';
import Axios from '../../scripts/axios';
import { useAuth } from '../../contexts/AuthContext/authenticatedUser';

export const ChangePassword = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authState } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const token = authState?.token;

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
    if (authState?.authenticated) myUser();
  }, [authState]);

  const handleChangePassword = async () => {
    if (currentPassword.length < 6) {
      return Alert.alert('Erro', 'A senha atual deve ter pelo menos 6 caracteres.');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas novas não coincidem.');
    }

    try {
      const res = await Axios.put(
        '/user',
        {
          email: email,
          name: userName,
          password: newPassword,
          role: 'User',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
        navigation.goBack();
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert('Erro', 'Usuário não encontrado.');
      } else {
        Alert.alert('Erro', 'Falha ao alterar a senha.');
      }
      console.error(err);
      console.log(email)
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-[#0F172A] p-5`}>
      <Animatable.View animation="fadeInUp" duration={600} style={tw`mt-10`}>
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
            <Text style={tw`text-white text-lg`}>{userName?.[0] || 'U'}</Text>
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-white text-base font-bold`}>{userName}</Text>
            <Text style={tw`text-gray-400 text-sm`}>Usuário ativo</Text>
          </View>
        </View>

        {/* Campos */}
        <View style={tw`mb-2`}>
          <Text style={tw`text-white mb-2`}>Senha Atual</Text>
          <TextInput
            placeholder="Digite sua senha atual"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

      {/* Link para Esqueceu a senha */}
        <TouchableOpacity onPress={() => navigation.navigate('Email')} style={tw`mb-6`}>
          <Text style={tw`text-blue-400 text-sm text-right`}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={tw`mb-6`}>
          <Text style={tw`text-white mb-2`}>Nova Senha</Text>
          <TextInput
            placeholder="Digite sua nova senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={tw`mb-10`}>
          <Text style={tw`text-white mb-2`}>Confirme a Nova Senha</Text>
          <TextInput
            placeholder="Confirme sua nova senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-white/5 text-white rounded px-4 py-3`}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Botões */}
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`flex-1 mr-2 bg-white rounded-xl py-3`}>
            <Text style={tw`text-center text-[#0F172A] font-semibold`}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangePassword} style={tw`flex-1 ml-2 bg-gray-700 rounded-xl py-3`}>
            <Text style={tw`text-center text-white font-semibold`}>
              Salvar alterações
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};
