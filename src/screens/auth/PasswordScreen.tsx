import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";
import { CustomModal } from "./Modal";

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const handleReset = async () => {
    setPressed(true);

    if (!recoveryCode || !newPassword || !confirmPassword) {
      setModalMsg("Preencha todos os campos.");
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMsg("As senhas não coincidem.");
      setModalVisible(true);
      return;
    }

    try {
      const res = await Axios.put("/auth", {
        recoveryCode,
        newPassword,
        confirmPassword
      });

      if (res.status === 200) {
        setModalMsg("Senha redefinida com sucesso!");
        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1500);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setModalMsg("Código inválido ou usuário não encontrado.");
      } else {
        setModalMsg("Erro ao redefinir senha.");
      }
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 bg-slate-900 items-center p-4`}>
      <Text style={tw`text-white text-2xl font-bold mb-10 mt-10`}>
        Redefinir Senha
      </Text>

      {/* Código de recuperação */}
      <View style={tw`w-full max-w-[300px] mb-4`}>
        <TextInput
          placeholder="Código de recuperação"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 p-3 rounded-lg text-white`}
          onChangeText={setRecoveryCode}
          value={recoveryCode}
        />
        {!recoveryCode && pressed && (
          <Text style={tw`text-red-500 mt-1`}>Este campo é obrigatório</Text>
        )}
      </View>

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
        onPress={handleReset}
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
