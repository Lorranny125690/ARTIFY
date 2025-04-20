import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from 'react';
import { ArrowLeft } from "lucide-react-native";
import tw from "twrnc";

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Recuperação: undefined
  Home: undefined;
  Email: undefined;
};

const userTest = {
  name: "João", email: "j@gmail.com", senha: "1234"
}

export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-slate-900 items-center px-6`}>
      
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={tw`absolute top-12 left-4 z-50`}
      >
      <ArrowLeft color="white" size={28} />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../assets/iconArtify.png")}
        style={tw`w-110 h-110`} 
        resizeMode="contain"
      />

      {/* Input de Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
      />

      {/* Input de Senha */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-4 p-3 rounded-lg text-white`}
      />

      {/* Esqueceu a senha */}
      <TouchableOpacity onPress={() => navigation.navigate("Email")}>
        <Text style={tw`text-gray-300 mb-12`}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity
        style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
      </TouchableOpacity>

      {/* Cadastro */}
      <View style={tw`flex-row`}>
        <Text style={tw`text-white`}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={tw`text-sky-400 underline`}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-slate-900 items-center px-6`}> 
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={tw`absolute top-12 left-4 z-50`}
      >
      <ArrowLeft color="white" size={28} />
      </TouchableOpacity>
      
      <Image
        source={require("../assets/iconArtify.png")}
        style={tw`w-110 h-110`} 
        resizeMode="contain"
      />
            
      {/* Inputs */}
      <TextInput 
        placeholder="Nome de usuário"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
      />
      <TextInput 
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
      />
      <TextInput 
        placeholder="Senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
      />
      <TextInput 
        placeholder="Confirmar senha"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        style={tw`bg-slate-800 w-full max-w-[300px] mb-8 p-3 rounded-lg text-white`}
      />
      
      {/* Botão Cadastrar */}
      <TouchableOpacity style={tw`bg-slate-800 py-2 px-10 rounded-lg mb-4 w-45 h-12 justify-center items-center`}>
        <Text style={tw`text-white text-lg font-semibold`}>Cadastrar</Text>
      </TouchableOpacity>
      
      {/* Link para Login */}
      <Text style={tw`text-gray-400`}>Já tem uma conta?
        <Text 
          style={tw`text-blue-400 underline`} 
          onPress={() => navigation.navigate("Login")}>
          Entrar
        </Text>
      </Text>
    </View>
  );
};

export const EmailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-slate-900 items-center px-6`}> 
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={tw`absolute top-12 left-6 z-50`}>
        <Text style={tw`text-white text-2xl`}>{"←"}</Text>
      </TouchableOpacity>
      
      <Image
        source={require("../assets/iconArtify.png")}
        style={tw`w-110 h-110`} 
        resizeMode="contain"
      />   

      <Text style={tw`text-white text-xl font-semibold text-center mb-2`}>
          Esqueceu a senha?
        </Text>
        <Text style={tw`text-slate-300 text-center mb-8`}>
          Redefina a senha em duas etapas
      </Text>
      
      {/* Inputs */}
      <TextInput 
        placeholder="Digite seu e-mail"
        placeholderTextColor="#B0B0B0"
        style={tw`bg-gray-800 w-full p-2 mb-4 rounded-lg text-white`}
      />

      {/* Botão Cadastrar */}
      <TouchableOpacity onPress={ () => navigation.navigate("Recuperação")}style={tw`bg-gray-700 py-3 px-6 rounded-lg w-full items-center mb-4`}>
        <Text style={tw`text-white text-lg font-semibold`}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

export const VerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [code, setCode] = useState(['', '', '', '', '']);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const isCodeComplete = code.every((digit) => digit !== '');

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 4) inputsRef.current[index + 1]?.focus();
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length < 5) return;

    setIsSubmitting(true);
    setMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      if (fullCode === '12345') {
        setMessage('✅ Código verificado com sucesso!');
        navigation.navigate("Login");
      } else {
        setMessage('❌ Código incorreto. Tente novamente.');
      }
    }, 1500);
  };

  const handleResend = () => {
    setMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('📩 Novo código enviado para seu e-mail!');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-slate-900`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow items-center justify-center px-6 pb-10`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          style={tw`absolute top-12 left-6`}
        >
          <Text style={tw`text-white text-2xl`}>{'←'}</Text>
        </TouchableOpacity>

        {/* Imagem de topo */}
        <Image
          source={require('../assets/iconArtify.png')}
          style={tw`w-100 h-90`}
          resizeMode="contain"
        />

        {/* Texto principal */}
        <Text style={tw`text-white text-lg text-center font-semibold mb-10`}>
          Acabamos de enviar um código{'\n'}para seu e-mail
        </Text>

        <Text style={tw`text-slate-400 text-center mt-2`}>
          Insira no campo abaixo o código de verificação de 5 dígitos enviado para o seu e-mail.
        </Text>

        {/* Campos de verificação */}
        <View style={tw`flex-row justify-between mt-6 w-full px-4`}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputsRef.current[index] = ref)}
              style={tw`bg-slate-800 text-white text-2xl w-14 h-14 text-center rounded`}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(code[index], index);
                }
              }}
            />
          ))}
        </View>

        {/* Botão de Enviar */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isCodeComplete || isSubmitting}
          style={tw.style(
            `mt-8 px-20 py-2 rounded`,
            isCodeComplete ? `bg-slate-800` : `bg-slate-700 opacity-50`
          )}
        >
          <Text style={tw`text-white text-lg font-semibold`}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Text>
        </TouchableOpacity>

        {/* Reenviar código */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={isSubmitting}
          style={tw`mt-4`}
        >
          <Text style={tw`text-sky-400`}>
            {isSubmitting ? 'Reenviando...' : 'Reenviar código'}
          </Text>
        </TouchableOpacity>

        {/* Mensagem de retorno */}
        {message !== '' && (
          <Text style={tw`text-white text-center mt-4`}>{message}</Text>
        )}

        <Text style={tw`text-gray-400 text-sm mt-2 text-center`}>
          Caso não encontre o e-mail na sua caixa de{'\n'}entrada, verifique na pasta de Spam!
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
