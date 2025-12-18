import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

import { GOOGLE_MAPS_API_KEY } from "@env";

export default function MapPickerScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: -12.046374, // Valor por defecto (Lima)
        longitude: -77.042793,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // Efecto para centrar el mapa en el usuario al iniciar
    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            } catch (error) {
                console.log("Error obteniendo ubicación:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleConfirm = async () => {
        let addressName = "Ubicación en el mapa"; 

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK" && data.results.length > 0) {
                // Nombre real de la calle desde Google
                addressName = data.results[0].formatted_address;
            } else {
                addressName = `Pin: ${region.latitude.toFixed(4)}, ${region.longitude.toFixed(4)}`;
            }
        } catch (error) {
            console.log("Error de red en Geocoding");
        }

        navigation.navigate("ExploreMain", {
            selectedLocation: {
                type,
                description: addressName,
                location: { lat: region.latitude, lng: region.longitude },
            },
        });
    };

    // Pantalla de carga mientras se obtiene el GPS
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.grayDark }}>Localizando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                showsUserLocation={true} // Muestra el punto azul del usuario
            />
            
            <View style={styles.markerFixed} pointerEvents="none">
                <View style={styles.pinHead} />
                <View style={styles.pinStick} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.infoText}>Mueve el mapa para elegir el punto</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmText}>Confirmar ubicación</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.white 
    },
    markerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -7,
        marginTop: -38,
        alignItems: 'center',
        zIndex: 10,
    },
    pinHead: { 
        width: 14, 
        height: 14, 
        borderRadius: 7, 
        backgroundColor: colors.primary, 
        borderWidth: 2, 
        borderColor: 'white',
        elevation: 5
    },
    pinStick: { 
        width: 3, 
        height: 25, 
        backgroundColor: colors.primary, 
        marginTop: -1 
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: spacing.md,
        borderRadius: 15,
        elevation: 5,
        alignItems: 'center'
    },
    infoText: { marginBottom: 10, color: colors.grayDark, fontWeight: '500' },
    confirmButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center'
    },
    confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});