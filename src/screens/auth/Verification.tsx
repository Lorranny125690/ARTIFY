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
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../types/rootStackParamList";
import Axios from "../../scripts/axios";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";

export const VerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [code, setCode] = useState(new Array(5).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const isCodeComplete = code.every((digit) => digit !== "");
  const { authState } = useAuth();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const token = authState?.token;

  useEffect(() => {
    console.log("EMAIL FOI SETADO:", email);
  }, [email]);  

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

  const handleContinue = () => {
    const fullCode = code.join("");
    console.log("Navegando com:", email, fullCode);
    console.log(email)
  
    if (!isCodeComplete || !email) {
      console.log("Código incompleto ou email vazio");
      return;
    }
  
    try {
      navigation.navigate("ResetPassword", { email: email, code: fullCode });
      ;
    } catch (err) {
      console.error("Erro na navegação:", err);
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
          Digite o código de 5 dígitos enviado para seu e-mail.
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

        {/* Botão Continuar */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isCodeComplete}
          style={tw.style(
            `mt-8 px-20 py-3 rounded-xl`,
            isCodeComplete
              ? `bg-sky-600`
              : `bg-slate-700 opacity-50`
          )}
        >
          <Text style={tw`text-white text-lg font-semibold`}>
            Continuar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
