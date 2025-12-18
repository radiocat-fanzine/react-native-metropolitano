import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('transporte_app.db');

export const initDB = () => {
    try {
        // Tabla de Sesión
        db.execSync(`
            CREATE TABLE IF NOT EXISTS session (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE,
                email TEXT,
                name TEXT,
                token TEXT,
                cardCode TEXT
            );
        `);

        // Tabla de Búsquedas (Cache de Mapa)
        db.execSync(`
            CREATE TABLE IF NOT EXISTS search_cache (
                key TEXT PRIMARY KEY, 
                description TEXT,
                lat REAL,
                lng REAL
            );
        `);

        try { db.execSync(`ALTER TABLE session ADD COLUMN name TEXT;`); } catch(e){}
        try { db.execSync(`ALTER TABLE session ADD COLUMN cardCode TEXT;`); } catch(e){}

        console.log("SQLite: Tablas inicializadas correctamente");
    } catch (error) {
        console.error("Error initDB:", error);
    }
};

/** FUNCIONES DE SESIÓN **/

export const saveUserSession = (userId, email, name = '', token = '', cardCode = '') => {
    try {
        db.runSync('DELETE FROM session'); 
        db.runSync(
            'INSERT INTO session (user_id, email, name, token, cardCode) VALUES (?, ?, ?, ?, ?);',
            [userId, email, name, token, cardCode]
        );
        console.log("SQLite: Sesión guardada localmente");
    } catch (error) {
        console.error("Error guardando sesión:", error);
    }
};

export const getUserSession = () => {
    try {
        return db.getFirstSync('SELECT * FROM session LIMIT 1;');
    } catch (error) {
        return null;
    }
};

export const deleteUserSession = () => {
    try {
        db.runSync('DELETE FROM session');
    } catch (error) {
        console.error("Error eliminando sesión:", error);
    }
};

/** FUNCIONES DE BÚSQUEDA (EXPLORE) **/

export const getSearchState = (key) => {
    try {
        return db.getFirstSync('SELECT * FROM search_cache WHERE key = ?', [key]);
    } catch (error) {
        console.error("SQLite: Error al obtener registro", error);
        return null;
    }
};

export const saveSearchState = (key, description, lat, lng) => {
    try {
        db.runSync(
            'INSERT OR REPLACE INTO search_cache (key, description, lat, lng) VALUES (?, ?, ?, ?);',
            [key, description, lat, lng]
        );
    } catch (error) {
        console.error("SQLite: Error al guardar búsqueda", error);
    }
};