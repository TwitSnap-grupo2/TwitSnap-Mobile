import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";

export default function ModalQuestion({
  question,
  isModalVisible,
  cancelAction,
  confirmAction,
}: {
  question: string;
  isModalVisible: boolean;
  cancelAction: () => void;
  confirmAction: () => void;
}) {
  return (
    <Modal isVisible={isModalVisible}>
      <View className="bg-white rounded-lg p-5 items-center">
        <Text className="text-lg font-semibold text-gray-800">{question}</Text>

        {/* Acciones dentro del modal */}
        <View className="flex-row mt-4 space-x-2">
          <TouchableOpacity
            onPress={confirmAction}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            <Text className="text-gray-800 font-medium">Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={cancelAction}
            className="px-4 py-2 bg-blue-500 rounded-lg mr-2"
          >
            <Text className="text-white font-medium">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
