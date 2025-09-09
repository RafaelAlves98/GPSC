import * as SQLite from 'expo-sqlite/next';

const db = SQLite.openDatabaseSync('places.db');

export async function init() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      imageUri TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
  `);
}

export async function insertPlace(imageUri, latitude, longitude) {
  const result = await db.runAsync(
    'INSERT INTO places (imageUri, latitude, longitude) VALUES (?, ?, ?)',
    imageUri,
    latitude,
    longitude
  );
  return result;
}

export async function fetchPlaces() {
  const allRows = await db.getAllAsync('SELECT * FROM places');
  return allRows;
}
