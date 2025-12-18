import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API_KEY } from "@env";
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

export default function LocationSearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || {};

    const handleCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Se requiere permiso para acceder a la ubicación");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        navigation.navigate("ExploreMain", {
            selectedLocation: {
                type,
                description: "Mi ubicación actual",
                location: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                },
            },
        });
    };

    // Datos temporales de favoritos
    const favs = [
        { id: '1', name: 'Casa', address: 'Av. Brasil 1234' },
        { id: '2', name: 'Trabajo', address: 'Canaval y Moreyra' }
    ];

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={type === 'origin' ? "Punto de partida" : "Punto de destino"}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    navigation.navigate("ExploreMain", {
                        selectedLocation: {
                            type,
                            description: data.description,
                            location: details?.geometry?.location,
                        },
                    });
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: "es",
                    components: "country:pe", // Mantiene la búsqueda en Perú
                    location: "-12.046374,-77.042793", // Coordenadas centrales de Lima (Plaza de Armas)
                    radius: "50000", // Radio de 50km
                    strictbounds: true,
                }}
                styles={{
                    textInput: styles.input,
                    listView: styles.listView,
                    row: styles.row,
                }}
                enablePoweredByContainer={false}

                renderHeaderComponent={() => (
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleCurrentLocation}>
                            <Text style={styles.actionText}>📍 Usar mi ubicación actual</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.favSection}>
                            <Text style={styles.sectionTitle}>Favoritos recientes</Text>
                            {favs.map(item => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    style={styles.favItem}
                                    onPress={() => navigation.navigate("ExploreMain", {
                                        selectedLocation: { type, description: item.name, location: null }
                                    })}
                                >
                                    <Text style={styles.favName}>⭐ {item.name}</Text>
                                    <Text style={styles.favAddress}>{item.address}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
                                <Text style={styles.seeMore}>Ver todos los favoritos</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
    input: { height: 50, borderRadius: 10, borderWidth: 1, borderColor: colors.grayLight, backgroundColor: '#fff', fontSize: 16 },
    listView: { marginTop: 10 },
    header: { backgroundColor: colors.background, marginBottom: 10 },
    actionButton: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    actionText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },
    favSection: { marginTop: 15 },
    sectionTitle: { fontSize: 14, color: colors.grayDark, fontWeight: 'bold', marginBottom: 10 },
    favItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    favName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    favAddress: { fontSize: 12, color: colors.gray },
    seeMore: { color: colors.primary, marginTop: 10, fontSize: 14, fontWeight: '600' },
    row: { padding: 13, height: 55 },
});