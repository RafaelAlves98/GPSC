import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Location from "expo-location";
import {AsyncStorage} from 'react-native';

export default function Gps() {
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [location, setLocation] = useState(null);

  const toggleGps = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a localização foi negada.");
      setIsGpsEnabled(false);
      return;
    }
    setIsGpsEnabled((prev) => !prev);
  };

  useEffect(() => {
    if (isGpsEnabled) {
      const getGpsLocation = async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        const endereco = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        await AsyncStorage.setItem('endereco',JSON.stringify(endereco))
      };
      getGpsLocation();
    } else {
      setLocation(null);
    }
  }, [isGpsEnabled]);

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => toggleGps()}>
          <Text>Permitir pegar a localização!</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
});
