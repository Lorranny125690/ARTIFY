import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal } from "react-native";
import React, { useState } from 'react';
import tw from "twrnc";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/40`}>
        <View style={tw`bg-slate-800 p-6 rounded-2xl w-72 items-center`}>
          <Text style={tw`text-xl font-bold mb-3 text-white`}>⚠️ Atenção</Text>
          <Text style={tw`text-base text-center text-sky-200 mb-5`}>
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={tw`bg-blue-500 px-5 py-2 rounded-xl`}
          >
            <Text style={tw`text-white text-base`}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};