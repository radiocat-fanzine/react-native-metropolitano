import { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API_KEY } from "@env";
import { subscribeToFavorites } from "../../services/favoriteService";
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

export default function LocationSearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || {};
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToFavorites((list) => {
            setFavorites(list || []);
        });
        return () => unsubscribe();
    }, []);

    const predefinedPlaces = useMemo(() => [
        {
            description: "📍 Usar mi ubicación actual",
            geometry: { location: { lat: 0, lng: 0 } },
            isCurrentLocation: true
        },
        {
            description: "🗺️ Seleccionar en el mapa",
            geometry: { location: { lat: 0, lng: 0 } },
            isMapPicker: true
        },
        ...favorites.map(fav => ({
            description: `⭐ ${fav.name} - ${fav.address}`,
            geometry: { location: { lat: fav.lat, lng: fav.lng } },
        }))
    ], [favorites]);

    const handleCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación.");
            return;
        }
        try {
            let locationData = await Location.getCurrentPositionAsync({});
            
            sendLocationBack("Mi ubicación actual", {
                lat: locationData.coords.latitude,
                lng: locationData.coords.longitude
            });
        } catch (error) {
            Alert.alert("Error", "No se pudo obtener la ubicación actual.");
        }
    };

    const sendLocationBack = (description, coords) => {
        navigation.navigate("ExploreMain", {
            selectedLocation: {
                type,
                description,
                location: coords,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>
                {type === 'origin' ? "Punto de partida" : "¿A dónde vas?"}
            </Text>

            <GooglePlacesAutocomplete
                placeholder={type === 'origin' ? "Desde donde sales..." : "Busca un destino..."}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (data.isCurrentLocation) {
                        handleCurrentLocation();
                    } else if (data.isMapPicker) {
                        navigation.navigate("MapPicker", { type });
                    } else {
                        const coords = details?.geometry?.location || data.geometry?.location;
                        sendLocationBack(data.description, coords);
                    }
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY, 
                    language: "es",
                    components: "country:pe",
                }}
                predefinedPlaces={predefinedPlaces}
                nearbyPlacesAPI="GooglePlacesSearch" 
                debounce={400}
                enablePoweredByContainer={false}
                styles={{
                    container: { flex: 0 }, 
                    textInput: styles.input,
                    listView: styles.listView,
                    row: styles.row,
                    description: { color: '#333', fontSize: 15 },
                    predefinedPlacesDescription: { 
                        color: colors.primary,
                        fontWeight: '700',
                        fontSize: 15
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: colors.white, 
        padding: spacing.lg, 
        paddingTop: 80 
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.black || "#1A1A1A",
        marginBottom: 25,
    },
    input: { 
        height: 55, 
        borderRadius: 15, 
        borderWidth: 1.5, 
        borderColor: colors.grayLight, 
        paddingHorizontal: 15, 
        fontSize: 16, 
        backgroundColor: '#fdfdfd',
        color: '#000',
    },
    listView: { 
        backgroundColor: 'white', 
        borderRadius: 12,
        elevation: 6,
        zIndex: 999,
        marginTop: 15, 
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden'
    },
    row: { 
        padding: 15, 
        height: 65, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f5f5f5', 
        justifyContent: 'center' 
    },
});