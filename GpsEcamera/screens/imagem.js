import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Imagem() {
  const [fotoUri, setFotoUri] = useState(null);

  const tirarFoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Permissão da câmera é necessária!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      await salvarFoto(uri);
    }
  };

  const escolherFoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Permissão da galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      await salvarFoto(uri);
    }
  };

  const salvarFoto = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
      const localizacao = await pegarLocalizacao();
      if (!localizacao) return;

      // Salva temporariamente no AsyncStorage para o ConectaBanco usar
      await AsyncStorage.setItem("ultimaFoto", JSON.stringify({ base64, localizacao }));
      console.log("Foto e localização salvos no AsyncStorage");
    } catch (err) {
      console.log("Erro ao salvar foto:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="📷 Tirar Foto" onPress={tirarFoto} />
      <View style={{ height: 10 }} />
      <Button title="🖼️ Escolher da Galeria" onPress={escolherFoto} />
      {fotoUri && <Image source={{ uri: fotoUri }} style={styles.imagem} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 8 },
  imagem: { width: 200, height: 200, marginTop: 10, borderRadius: 8 },
});
