import { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchForm from "./components/SearchForm";
import colors from "../../styles/colors";

import { saveSearchState, getSearchState } from "../../api/sqlite";

export default function ExploreScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isFastestRoute, setIsFastestRoute] = useState(false);

    // Carga de datos al iniciar desde SQLite
    useEffect(() => {
        const cachedOrigin = getSearchState('origin');
        const cachedDest = getSearchState('destination');

        if (cachedOrigin) {
            setOrigin({ 
                description: cachedOrigin.description, 
                location: { lat: cachedOrigin.lat, lng: cachedOrigin.lng } 
            });
        }
        if (cachedDest) {
            setDestination({ 
                description: cachedDest.description, 
                location: { lat: cachedDest.lat, lng: cachedDest.lng } 
            });
        }
    }, []);

    // Recibe cambios del MapPicker o LocationSearch y guarda permanentemente
    useEffect(() => {
        if (route.params?.selectedLocation) {
            const { type, description, location } = route.params.selectedLocation;
            
            saveSearchState(type, description, location.lat, location.lng);

            if (type === "origin") {
                setOrigin({ description, location });
            } else {
                setDestination({ description, location });
            }

            navigation.setParams({ selectedLocation: undefined });
        }
    }, [route.params?.selectedLocation]);

    const handleSwap = () => {
        if (origin && destination) {
            saveSearchState('origin', destination.description, destination.location.lat, destination.location.lng);
            saveSearchState('destination', origin.description, origin.location.lat, origin.location.lng);
            
            const tempOrigin = origin;
            setOrigin(destination);
            setDestination(tempOrigin);
        }
    };

    // Funcion para limpiar el formulario
    const handleClearForm = () => {
        // Limpia estados visuales
        setOrigin(null);
        setDestination(null);

        // Limpia SQLite al recargar
        try {
            saveSearchState('origin', null, null, null);
            saveSearchState('destination', null, null, null);
        } catch (error) {
            console.log("Error limpiando caché:", error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background || '#fff' }}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <SearchForm 
                    originData={origin}
                    destinationData={destination}
                    onSwap={handleSwap}
                    onClear={handleClearForm}
                    isFastestRoute={isFastestRoute}
                    setIsFastestRoute={setIsFastestRoute}
                />
            </ScrollView>
        </SafeAreaView>
    );
}