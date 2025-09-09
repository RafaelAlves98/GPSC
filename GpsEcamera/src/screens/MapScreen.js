import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

export default function MapScreen() {
  const route = useRoute();
  const { imageUri, latitude, longitude } = route.params;

  const mapRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <MapView style={styles.map} initialRegion={mapRegion}>
        <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '40%',
  },
  map: {
    width: '100%',
    height: '60%',
  },
});
