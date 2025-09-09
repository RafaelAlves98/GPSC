import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function ConectaBanco() {
    const db = await SQLite.openDatabaseAsync('BancoApp');
    const [localizacao, setLocalizacao] = useState(null);
    const [imagem,setImagem] = useState(null);
    const [dados,setDados] = useState([]);

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS fotosElocalizacao (id INT AUTO_INCREMENT PRIMARY KEY, imagem LONGBLOB NOT NULL, localizacao TEXT NOT NULL);
    `);

    const pegarTudo = async () => {
      const allRows = await db.getAllAsync('SELECT * FROM fotosElocalizacao');
      for (const row of allRows) {
        const id = row.id
        const imagem = row.imagem
        const localizacao = row.localizacao
        const umDado = [id,imagem,localizacao]
        setDados([...dados, umDado]);
      }
    };

    const salvar = async () => {
      const statement = await db.prepareAsync(
        'INSERT INTO fotosElocalizacao (imagem, localizacao) VALUES ($imagem, $localizacao)'
      );
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
          renderItem={({ item }) => <Text>Id: {item.id}, localizacao: {item.localizacao}, imagem: {item.imagem}</Text>} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});