import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from "@env"; // Asegúrate que el nombre coincida con tu .env
import { subscribeToFavorites } from "../../services/favoriteService";
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

export default function LocationSearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || {};
    const [favorites, setFavorites] = useState([]);

    // Cargar favoritos reales de Firebase
    useEffect(() => {
        const unsubscribe = subscribeToFavorites((list) => {
            setFavorites(list);
        });
        return () => unsubscribe();
    }, []);

    const handleCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Permiso denegado");
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        navigation.navigate("ExploreMain", {
            selectedLocation: {
                type,
                description: "Mi ubicación actual",
                coords: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                },
            },
        });
    };

    // Convertir favoritos al formato de GooglePlacesAutocomplete
    const predefinedPlaces = [
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
            isFavorite: true
        }))
    ];

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={type === 'origin' ? "Desde" : "Hacia"}
                fetchDetails={true}
                minLength={0}
                onPress={(data, details = null) => {
                    if (data.isCurrentLocation) {
                        handleCurrentLocation();
                    } else if (data.isMapPicker) {
                        console.log("Abrir Mapa");
                    } else {
                        navigation.navigate("ExploreMain", {
                            selectedLocation: {
                                type,
                                description: data.description,
                                coords: {
                                    lat: details?.geometry?.location.lat,
                                    lng: details?.geometry?.location.lng
                                },
                            },
                        });
                    }
                }}
                predefinedPlaces={predefinedPlaces}
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: "es",
                    components: "country:pe",
                    location: "-12.046374,-77.042793",
                    radius: "50000",
                }}
                styles={{
                    textInput: styles.input,
                    listView: styles.listView,
                    row: styles.row,
                    description: { color: colors.textPrimary }
                }}
                enablePoweredByContainer={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, padding: spacing.md, paddingTop: 40 },
    input: { height: 50, borderRadius: 10, borderWidth: 1, borderColor: colors.grayLight, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
    listView: { borderTopWidth: 0, elevation: 5, backgroundColor: 'white', borderRadius: 10 },
    row: { padding: 15, height: 60, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
});