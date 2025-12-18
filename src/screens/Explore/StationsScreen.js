import { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Platform, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";

import stationsData from "../../data/stations.json"; 
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

const { width, height } = Dimensions.get("window");

export default function StationsScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { origin, destination } = route.params || {};

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const openInGoogleMaps = (lat, lng, label) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url).catch(() => Alert.alert("Error", "No se pudo abrir el mapa."));
    };

    const routePlan = useMemo(() => {
        if (!origin?.location || !destination?.location) return null;
        const sortedByOrigin = stationsData.map(s => ({
            ...s,
            dist: calculateDistance(origin.location.lat, origin.location.lng, s.lat, s.lng)
        })).sort((a, b) => a.dist - b.dist);

        const sortedByDest = stationsData.map(s => ({
            ...s,
            dist: calculateDistance(destination.location.lat, destination.location.lng, s.lat, s.lng)
        })).sort((a, b) => a.dist - b.dist);

        return {
            startStation: sortedByOrigin[0],
            endStation: sortedByDest[0],
            allNearbyStations: sortedByOrigin 
        };
    }, [origin, destination]);

    if (!routePlan) return null;

    return (
        <View style={styles.container}>
            {/* Mapa */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: (origin.location.lat + destination.location.lat) / 2,
                        longitude: (origin.location.lng + destination.location.lng) / 2,
                        latitudeDelta: Math.abs(origin.location.lat - destination.location.lat) * 2.5,
                        longitudeDelta: Math.abs(origin.location.lng - destination.location.lng) * 2.5,
                    }}
                >
                    <Polyline
                        coordinates={[
                            { latitude: routePlan.startStation.lat, longitude: routePlan.startStation.lng },
                            { latitude: routePlan.endStation.lat, longitude: routePlan.endStation.lng }
                        ]}
                        strokeColor={colors.primary}
                        strokeWidth={4}
                    />
                    <Marker coordinate={{ latitude: origin.location.lat, longitude: origin.location.lng }} pinColor="blue" title="Tu origen" />
                    <Marker coordinate={{ latitude: destination.location.lat, longitude: destination.location.lng }} pinColor="green" title="Tu destino" />
                    <Marker coordinate={{ latitude: routePlan.startStation.lat, longitude: routePlan.startStation.lng }} title="Sube aquí" />
                    <Marker coordinate={{ latitude: routePlan.endStation.lat, longitude: routePlan.endStation.lng }} title="Baja aquí" />
                </MapView>
            </View>

            {/* Tarjeta Principal de Ruta */}
            <View style={styles.routeCard}>
                <View style={styles.step}>
                    <View style={styles.dot} />
                    <View>
                        <Text style={styles.stepLabel}>PUNTO DE SALIDA</Text>
                        <Text style={styles.stationName}>{routePlan.startStation.name}</Text>
                        <Text style={styles.distText}>A {routePlan.startStation.dist.toFixed(2)} km de tu ubicación</Text>
                    </View>
                </View>

                <View style={styles.line} />

                <View style={styles.step}>
                    <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                    <View>
                        <Text style={styles.stepLabel}>PUNTO DE LLEGADA</Text>
                        <Text style={styles.stationName}>{routePlan.endStation.name}</Text>
                        <Text style={styles.distText}>A {routePlan.endStation.dist.toFixed(2)} km del destino</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.btnMaps}
                    onPress={() => openInGoogleMaps(routePlan.startStation.lat, routePlan.startStation.lng, routePlan.startStation.name)}
                >
                    <Text style={styles.btnMapsText}>📍 Cómo llegar a la estación</Text>
                </TouchableOpacity>
            </View>

            {/* Contenedor de Estaciones Cercanas */}
            <View style={styles.nearbyCard}>
                <Text style={styles.sectionTitle}>Estaciones cercanas adicionales</Text>
                <FlatList
                    data={routePlan.allNearbyStations.slice(1, 6)}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={styles.listIconContainer}>
                                <Text style={styles.listIcon}>🚉</Text>
                            </View>
                            <View style={styles.listContent}>
                                <Text style={styles.listName}>{item.name}</Text>
                                <Text style={styles.listDist}>{item.dist.toFixed(2)} km</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background || '#F2F2F7' },
    mapContainer: { height: height * 0.28, width: width },
    map: { ...StyleSheet.absoluteFillObject },
    routeCard: {
        marginTop: -20,
        marginHorizontal: spacing.lg,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    step: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginRight: 15 },
    line: { width: 2, height: 25, backgroundColor: '#E5E5EA', marginLeft: 4, marginVertical: 4 },
    stepLabel: { fontSize: 9, fontWeight: '700', color: colors.gray, letterSpacing: 1 },
    stationName: { fontSize: 17, fontWeight: 'bold', color: '#1C1C1E' },
    distText: { fontSize: 11, color: '#8E8E93' },
    btnMaps: {
        marginTop: 15,
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center'
    },
    btnMapsText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    
    nearbyCard: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: spacing.lg,
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
        borderColor: '#C6C6C8',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, color: '#1C1C1E', paddingLeft: 5 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    listIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    listIcon: { fontSize: 18 },
    listContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listName: { fontSize: 14, color: '#3A3A3C', fontWeight: '500' },
    listDist: { fontSize: 13, color: colors.primary, fontWeight: '600' }
});