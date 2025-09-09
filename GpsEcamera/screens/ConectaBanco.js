import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList } from "react-native";
import * as SQLite from 'expo-sqlite';
import Gps from './Gps';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConectaBanco() {
    const [db,setDb] = useState(null);
    const [localizacao, setLocalizacao] = useState(null);
    const [imagem,setImagem] = useState(null);
    const [dados,setDados] = useState([]);

    const criarBanco = async () => {
      const database = await SQLite.openDatabaseAsync('BancoApp');
      setDb(database);
      await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS fotosElocalizacao (id INTEGER PRIMARY KEY AUTOINCREMENT, imagem BLOB NOT NULL, localizacao TEXT NOT NULL);
      `);
    };

    const pegarTudo = async () => {
      const allRows = await db.getAllAsync('SELECT * FROM fotosElocalizacao');
      setDados(allRows)
    };

    const salvar = async () => {
      if (!db){
        criarBanco()
      }
      const statement = await db.prepareAsync(
        'INSERT INTO fotosElocalizacao (imagem, localizacao) VALUES ($imagem, $localizacao)'
      );
      const loc = await AsyncStorage.getItem('endereco')
      setLocalizacao(loc)
      try {
        if (imagem != null && localizacao != null){
          let result = await statement.executeAsync({ $imagem: imagem, $localizacao: localizacao });
          console.log(result.lastInsertRowId, result.changes);
        }
      } finally {
        await statement.finalizeAsync();
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => salvar()}>
            <Text>Salvar!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pegarTudo()}>
            <Text>Ver o que está salvo!</Text>
        </TouchableOpacity>
        <FlatList
          data={dados} 
          keyExtractor={(item) => item.id.toString()}  
          renderItem={({ item }) => <Text>Id: {item.id}, localizacao: {item.localizacao}, imagem: {item.imagem}</Text>} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});