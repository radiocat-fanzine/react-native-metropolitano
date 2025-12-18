import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchForm from "./components/SearchForm";
import colors from "../../styles/colors";

export default function ExploreScreen() {
    const route = useRoute();
    
    // Estados para Origen y Destino
    const [origin, setOrigin] = useState({ description: "Desde", coords: null });
    const [destination, setDestination] = useState({ description: "Hacia", coords: null });
    
    // Estado para el Toggle
    const [isFastestRoute, setIsFastestRoute] = useState(false);

    useEffect(() => {
        if (route.params?.selectedLocation) {
            const { type, description, location } = route.params.selectedLocation;
            
            if (type === "origin") {
                setOrigin({ description, coords: location });
            } else {
                setDestination({ description, coords: location });
            }
        }
    }, [route.params?.selectedLocation]);

    // Función Swap
    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background || '#fff' }}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <SearchForm 
                    origin={origin.description} 
                    destination={destination.description}
                    originData={origin}
                    destinationData={destination}
                    onSwap={handleSwap}
                    isFastestRoute={isFastestRoute}
                    setIsFastestRoute={setIsFastestRoute}
                />
            </ScrollView>
        </SafeAreaView>
    );
}