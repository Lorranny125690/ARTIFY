import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";

type EmailScreenNavigationProp = StackNavigationProp<RootStackParamList, "Email">;

export const EmailScreen: React.FC = () => {
  const navigation = useNavigation<EmailScreenNavigationProp>();

  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSendCode = async (): Promise<void> => {
    setMessage("");
    try {
      const response = await Axios.patch(
        "/auth",
        { email }
      );
  
      if (response.status === 200) {
        setMessage("✅ Código enviado para o e-mail!");
        navigation.navigate("Recuperação", { email });
      } else {
        setMessage(`❌ Erro: ${response.data.Description ?? response.data.message ?? "Erro desconhecido"}`);
      }
    } catch (error: any) {
      if (error.response) {
        setMessage(`❌ Erro: ${error.response.data?.Description ?? error.response.data?.message ?? "Erro desconhecido"}`);
      } else {
        setMessage("❌ Erro de rede");
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-slate-900 items-center px-6`}
    >
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-12 left-4 z-50`}
      >
        <ArrowLeft color="white" size={28} />
      </TouchableOpacity>

      <Image
        source={require("../../assets/Logo.png")}
        style={tw`w-90 h-90 mt-10`}
        resizeMode="contain"
      />

      <Text style={tw`text-white text-xl font-semibold text-center mb-2`}>
        Esqueceu a senha?
      </Text>
      <Text style={tw`text-slate-300 text-center mb-18`}>
        Redefina a senha em duas etapas
      </Text>

      <View style={tw`gap-5 mb-8`}>
        <Text style={tw`text-white text-sl font-semibold mb-2`}>
          Qual seu e-mail de cadastro?
        </Text>
        <TextInput
          placeholder="Digite seu e-mail"
          placeholderTextColor="#B0B0B0"
          style={tw`bg-slate-800 p-3 w-80 rounded-lg text-white`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={handleSendCode}
        />
      </View>

      {message.length > 0 && (
        <Text style={tw`text-center mb-4 text-white`}>{message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSendCode}
        style={tw`bg-slate-800 rounded-lg px-15 py-3 items-center mb-4 w-80`}
      >
        <Text style={tw`text-center text-white text-sl font-semibold`}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
