import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Gps from '../screens/Gps';
import ConectaBanco from '../screens/ConectaBanco';

export default function App() {
  return (
    <View style={styles.container}>
      <View component={Gps}></View>
      <View component={ConectaBanco}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
