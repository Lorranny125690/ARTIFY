import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";

export const VerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(new Array(5).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const isCodeComplete = code.every((digit) => digit !== "");
  const isPasswordValid = newPassword.length >= 6;
  const { authState } = useAuth();

  const myUser = async () => {
    try {
      const token = authState?.token
      
      const result = await Axios.get(`/user`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(result.data);
      
      const username = result.data.user.email;
      setEmail(username)
    } catch (e: any) {
      console.warn("Erro ao buscar usuário:", e?.response?.data?.msg || e.message);
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      myUser();
    }
  }, [authState, email]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    if (text && !/^\d$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (!isCodeComplete || !isPasswordValid || !email) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await Axios.put(
        "/auth",
        {
          passport: fullCode,
          refString: email,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("✅ Senha redefinida com sucesso!");
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        setMessage("❌ Erro ao redefinir senha.");
      }
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setMessage("❌ Código inválido ou erro interno.");
      console.log("Erro do servidor:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-slate-900`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow items-center justify-center px-6 pb-10`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Voltar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-12 left-4 z-50`}
        >
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require("../../assets/iconArtify.png")}
          style={tw`w-80 h-80`}
          resizeMode="contain"
        />

        <Text style={tw`text-white text-lg text-center font-semibold mb-4`}>
          Código de Verificação
        </Text>

        <Text style={tw`text-slate-400 text-center mb-4`}>
          Digite o código de 5 dígitos enviado para seu e-mail e escolha sua nova senha.
        </Text>

        {/* Campo Código */}
        <View style={tw`flex-row justify-between mt-2 w-full px-4`}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              style={tw`bg-slate-800 text-white text-2xl w-14 h-14 text-center rounded`}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(code[index], index);
                }
              }}
            />
          ))}
        </View>

        {/* Campo Nova Senha */}
        <View style={tw`w-full max-w-[300px] mt-6`}>
          <Text style={tw`text-white mb-2`}>Nova Senha</Text>
          <TextInput
            placeholder="Digite sua nova senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={tw`bg-slate-800 text-white rounded px-4 py-3`}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {!isPasswordValid && newPassword !== "" && (
            <Text style={tw`text-red-400 text-xs mt-1`}>
              A senha precisa de pelo menos 6 caracteres
            </Text>
          )}
        </View>

        {/* Botão Enviar */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isCodeComplete || !isPasswordValid || isSubmitting}
          style={tw.style(
            `mt-8 px-20 py-3 rounded-xl`,
            isCodeComplete && isPasswordValid
              ? `bg-slate-800`
              : `bg-slate-700 opacity-50`
          )}
        >
          <Text style={tw`text-white text-lg font-semibold`}>
            {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
          </Text>
        </TouchableOpacity>

        {/* Mensagem */}
        {message !== "" && (
          <Text style={tw`text-white text-center mt-6`}>{message}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
