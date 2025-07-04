import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import type { ImageType } from "../../contexts/ImageContext/imageContext";
import Axios from "../../scripts/axios";
import { useAuth } from "../../contexts/AuthContext/authenticatedUser";
import { useFocusEffect } from "@react-navigation/native";

export function LastProcess() {
  const { authState } = useAuth();
  const token = authState?.token;

  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchLastProcess = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await Axios.get("/processes/recent", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (isActive) {
            if (Array.isArray(response.data.images)) {
              setImages(response.data.images);
            } else {
              throw new Error("Formato inesperado na resposta.");
            }
          }
        } catch (err: any) {
          console.log("Erro:", err?.response ?? err);
          if (err.response?.status === 404) {
            setError("Usuário não encontrado.");
          } else {
            setError("Erro ao buscar o último processamento.");
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      if (token) {
        fetchLastProcess();
      } else {
        console.log("Token não disponível ainda");
        setLoading(false);
      }

      return () => {
        isActive = false;
      };
    }, [token])
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={tw`text-slate-300 mt-4`}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
        <Text style={tw`text-red-400 text-base`}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={tw`p-4 bg-slate-900 min-h-full`}>
      <Text style={tw`text-slate-100 text-xl font-bold mb-4`}>
        Último Processamento
      </Text>

      {images.length > 0 ? (
        images.map((img) => (
          <View key={img.id} style={tw`mb-6 bg-slate-800 p-3 rounded-lg`}>
            <Image
              source={{ uri: img.uri }}
              style={tw`w-full h-64 rounded-md mb-2`}
              resizeMode="cover"
            />
            <Text style={tw`text-slate-200 font-semibold`}>{img.filename}</Text>
            <Text style={tw`text-slate-400 text-sm`}>
              {img.dataFormatada}
            </Text>
          </View>
        ))
      ) : (
        <Text style={tw`text-slate-300`}>Nenhuma imagem encontrada.</Text>
      )}
    </ScrollView>
  );
}
