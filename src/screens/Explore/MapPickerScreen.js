import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';
import { GOOGLE_PLACES_API_KEY } from "@env";

export default function MapPickerScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    
    const { origin, initialLocation, existingName, type } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: initialLocation?.latitude || -12.046374, 
        longitude: initialLocation?.longitude || -77.042793,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    useEffect(() => {
        (async () => {
            try {
                if (initialLocation) {
                    setLoading(false);
                    return;
                }
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLoading(false);
                    return;
                }
                let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                setRegion(prev => ({
                    ...prev,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }));
            } catch (error) {
                console.log("Error GPS:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [initialLocation]);

    const handleConfirm = async () => {
        let addressName = `${region.latitude.toFixed(5)}, ${region.longitude.toFixed(5)}`;
        
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${GOOGLE_PLACES_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK" && data.results.length > 0) {
                addressName = data.results[0].formatted_address;
            }
        } catch (error) {
            console.log("Error en Geocoding:", error);
        }

        if (origin === 'Favorites') {
            // Vuelve a Favoritos
            navigation.navigate("FavoritesMain", {
                selectedLocation: {
                    address: addressName,
                    latitude: region.latitude,
                    longitude: region.longitude,
                    returnedName: existingName 
                }
            });
        } else {
            // Vuelve a Explore
            navigation.navigate("ExploreMain", {
                selectedLocation: {
                    type: type,
                    description: addressName,
                    location: { lat: region.latitude, lng: region.longitude },
                },
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                showsUserLocation={true}
            />
            
            <View style={styles.markerFixed} pointerEvents="none">
                <View style={styles.pinHead} />
                <View style={styles.pinStick} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmText}>Confirmar esta ubicación</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
    markerFixed: { position: 'absolute', top: '50%', left: '50%', marginLeft: -10, marginTop: -40, alignItems: 'center', zIndex: 10 },
    pinHead: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, borderWidth: 3, borderColor: 'white' },
    pinStick: { width: 4, height: 20, backgroundColor: colors.primary },
    footer: { position: 'absolute', bottom: 40, left: 20, right: 20, zIndex: 20 },
    confirmButton: { backgroundColor: colors.primary, padding: 18, borderRadius: 15, alignItems: 'center', elevation: 10 },
    confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});