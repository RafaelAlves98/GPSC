import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConectaBanco() {
    const [db, setDb] = useState(null);
    const [dados, setDados] = useState([]);

    useEffect(() => { criarBanco(); }, []);

    const criarBanco = async () => {
        const database = await SQLite.openDatabaseAsync('BancoApp');
        setDb(database);
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS fotosElocalizacao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                imagem BLOB NOT NULL,
                latitude TEXT NOT NULL,
                longitude TEXT NOT NULL
            );
        `);
    };

    const salvar = async () => {
        if (!db) return;

        const base64Foto = await AsyncStorage.getItem('ultimaFoto');
        const latitude = await AsyncStorage.getItem('latitudeFoto');
        const longitude = await AsyncStorage.getItem('longitudeFoto');

        if (!latitude){
            const latitude = await AsyncStorage.getItem('latitudeAtual');
        }

        if (!longitude){
            const longitude = await AsyncStorage.getItem('longitudeAtual');
        }

        if (!base64Foto) { alert("Nenhuma foto para salvar!"); return; }
        if (!latitude) { alert("Latitude não encontrada!"); return; }
        if (!longitude) { alert("Longitude não encontrada!"); return;}

        const statement = await db.prepareAsync(
            'INSERT INTO fotosElocalizacao (imagem, latitude, longitude) VALUES ($imagem, $latitude, $longitude)'
        );

        try {
            await statement.executeAsync({ $imagem: base64Foto, $latitude: latitude, $longitude: longitude });
            alert("Foto e localização salvas no banco!");
        } finally {
            await statement.finalizeAsync();
        }
    };

    const pegarTudo = async () => {
        if (!db) return;
        const allRows = await db.getAllAsync('SELECT * FROM fotosElocalizacao');
        setDados(allRows);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={salvar}>
                <Text>💾 Salvar Foto + Localização</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={pegarTudo}>
                <Text>📄 Ver o que está salvo</Text>
            </TouchableOpacity>

            <FlatList
                data={dados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                        <Text>Id: {item.id}</Text>
                        <Text>Localização: </Text>
                        <Text>Latitude: {item.latitude}</Text>
                        <Text>Longitude: {item.longitude}</Text>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                            style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 8 },
    button: { alignItems: "center", backgroundColor: "#DDDDDD", padding: 10, marginVertical: 10 },
});
