import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./src/redux/store"; 
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from "react-native";

import { initDB, getUserSession } from "./src/api/sqlite";
import { setUser } from "./src/redux/userSlice";

// Componente que maneja la lógica de carga
function AppContent() {
    const dispatch = useDispatch();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadSession = async () => {
            try {
                // Inicializa la base de datos
                initDB();

                // Busca si hay una sesión guardada
                const session = getUserSession();
                
                if (session) {
                    console.log("Sesión recuperada de SQLite para:", session.email);
                    // Cargan los datos en Redux
                    dispatch(setUser({
                        uid: session.user_id,
                        email: session.email,
                        name: session.name
                    }));
                }
            } catch (error) {
                console.error("Error cargando sesión inicial:", error);
            } finally {
                // Finaliza la carga
                setIsReady(true);
            }
        };

        loadSession();
    }, [dispatch]);

    // Mientras verifica SQLite, sale "cargando.." 
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <AppNavigator />
            <Toast />
        </SafeAreaProvider>
    );
}

// Componente Principal
export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}