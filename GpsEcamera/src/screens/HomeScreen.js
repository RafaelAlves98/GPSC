import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { insertPlace, fetchPlaces } from '../database';

export default function HomeScreen() {
  const [places, setPlaces] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  const loadPlaces = async () => {
    const dbResult = await fetchPlaces();
    setPlaces(dbResult);
  };

  const takePhotoHandler = async () => {
    const hasCameraPermission = await verifyCameraPermissions();
    const hasLocationPermission = await verifyLocationPermissions();

    if (!hasCameraPermission || !hasLocationPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (image.canceled) {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    await insertPlace(
      image.assets[0].uri,
      location.coords.latitude,
      location.coords.longitude
    );
    loadPlaces();
  };

  const verifyCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return false;
    }
    return true;
  };

  const verifyLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need location permissions to make this work!');
      return false;
    }
    return true;
  };

  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.placeItem}
      onPress={() => navigation.navigate('Map', {
        imageUri: item.imageUri,
        latitude: item.latitude,
        longitude: item.longitude,
       })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{`Lat: ${item.latitude.toFixed(2)}, Lon: ${item.longitude.toFixed(2)}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takePhotoHandler} />
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlaceItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
  },
  info: {
    marginLeft: 25,
    width: 250,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5,
  },
});
