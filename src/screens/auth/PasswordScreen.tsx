import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";
import { CustomModal } from "./Modal";

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
  const { email, code } = route.params; // ambos devem ser strings  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const handleSubmit = async () => {
    setPressed(true);

    if (!newPassword || !confirmPassword) {
      setModalMsg("Por favor, preencha todos os campos.");
      setModalVisible(true);
      return;
    }

    if (newPassword.length < 6) {
      setModalMsg("A senha deve conter pelo menos 6 caracteres.");
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMsg("As senhas não coincidem.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await Axios.put("/auth", {
        passport: code,
        refString: `${email}-${code}`,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        Alert.alert("✅ Senha atualizada com sucesso!");
        navigation.navigate("Login");
      }
    } catch (e: any) {
      console.error("Erro:", e.response?.data || e.message);
      setModalMsg("❌ Erro ao redefinir a senha. Verifique o código ou tente novamente.");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center p-4`}>
      <Text style={tw`text-white text-2xl font-bold mb-10 mt-10`}>
        Redefinir Senha
      </Text>

      {/* Nova senha */}
      <View style={tw`w-full max-w-[300px] mb-4`}>
        <TextInput
          placeholder="Nova senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setNewPassword}
          value={newPassword}
        />
      </View>

      {/* Confirmar nova senha */}
      <View style={tw`w-full max-w-[300px] mb-6`}>
        <TextInput
          placeholder="Confirme sua nova senha"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
      </View>

      <TouchableOpacity
        style={tw`bg-sky-600 rounded-lg px-12 py-3 mb-4`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-semibold`}>Redefinir Senha</Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMsg}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={tw`text-gray-400 underline mt-4`}>
          Voltar ao login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
