import { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Platform, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";

import stationsData from "../../data/stations.json"; 
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

const { width } = Dimensions.get("window");

export default function StationsScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Extraemos origen y destino de los parámetros de navegación
    const { origin, destination } = route.params || {};

    // Fórmula Haversine para calcular distancia entre coordenadas
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Función para abrir la ruta en la aplicación de mapas del dispositivo
    const openInGoogleMaps = (lat, lng, label) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "No se pudo abrir la aplicación de mapas.");
        });
    };

    // Lógica principal: Calcular estación de inicio y estación de fin
    const routePlan = useMemo(() => {
        if (!origin?.coords || !destination?.coords) return null;

        // Buscar estación más cercana al ORIGEN (Donde sube)
        const sortedByOrigin = stationsData.map(s => ({
            ...s,
            dist: calculateDistance(origin.coords.lat, origin.coords.lng, s.lat, s.lng)
        })).sort((a, b) => a.dist - b.dist);

        // Buscar estación más cercana al DESTINO (Donde baja)
        const sortedByDest = stationsData.map(s => ({
            ...s,
            dist: calculateDistance(destination.coords.lat, destination.coords.lng, s.lat, s.lng)
        })).sort((a, b) => a.dist - b.dist);

        return {
            startStation: sortedByOrigin[0],
            endStation: sortedByDest[0],
            allStations: sortedByOrigin
        };
    }, [origin, destination]);

    if (!routePlan) {
        return (
            <View style={styles.container}>
                <Text>Cargando datos de ruta...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con botón de retroceso */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Tu Plan de Viaje</Text>
            </View>

            {/* Mapa con la ubicación de las estaciones */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: (origin.coords.lat + destination.coords.lat) / 2,
                        longitude: (origin.coords.lng + destination.coords.lng) / 2,
                        latitudeDelta: 0.12,
                        longitudeDelta: 0.12,
                    }}
                >
                    {/* Dibuja la ruta del Metropolitano en el mapa */}
                    <Polyline
                        coordinates={[
                            { latitude: routePlan.startStation.lat, longitude: routePlan.startStation.lng },
                            { latitude: routePlan.endStation.lat, longitude: routePlan.endStation.lng }
                        ]}
                        strokeColor={colors.primary}
                        strokeWidth={4}
                        lineDashPattern={[5, 2]}
                    />
                    <Marker 
                        coordinate={{ latitude: origin.coords.lat, longitude: origin.coords.lng }}
                        title="Origen"
                        pinColor="blue"
                    />
                    <Marker 
                        coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }}
                        title="Destino"
                        pinColor="green"
                    />
                    <Marker 
                        coordinate={{ latitude: routePlan.startStation.lat, longitude: routePlan.startStation.lng }}
                        title={`Sube aquí: ${routePlan.startStation.name}`}
                    />
                    <Marker 
                        coordinate={{ latitude: routePlan.endStation.lat, longitude: routePlan.endStation.lng }}
                        title={`Baja aquí: ${routePlan.endStation.name}`}
                    />
                </MapView>
            </View>

            {/* Tarjeta de Ruta detallada */}
            <View style={styles.routeCard}>
                <View style={styles.step}>
                    <View style={styles.dot} />
                    <View>
                        <Text style={styles.stepLabel}>PUNTO DE EMBARQUE</Text>
                        <Text style={styles.stationName}>{routePlan.startStation.name}</Text>
                        <Text style={styles.distText}>A {routePlan.startStation.dist.toFixed(1)} km de tu origen</Text>
                    </View>
                </View>

                <View style={styles.line} />

                <View style={styles.step}>
                    <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                    <View>
                        <Text style={styles.stepLabel}>PUNTO DE DESEMBARQUE</Text>
                        <Text style={styles.stationName}>{routePlan.endStation.name}</Text>
                        <Text style={styles.distText}>A {routePlan.endStation.dist.toFixed(1)} km de tu destino</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.btnMaps}
                    onPress={() => openInGoogleMaps(routePlan.startStation.lat, routePlan.startStation.lng, routePlan.startStation.name)}
                >
                    <Text style={styles.btnMapsText}>📍 Ver camino a la estación</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Otras estaciones cercanas</Text>
            <FlatList
                data={routePlan.allStations.slice(1, 5)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listName}>{item.name}</Text>
                        <Text style={styles.listDist}>{item.dist.toFixed(1)} km</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff' },
    backBtn: { marginBottom: 5 },
    backText: { color: colors.primary, fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.grayDark },
    mapContainer: { height: 220, width: width },
    map: { ...StyleSheet.absoluteFillObject },
    routeCard: {
        margin: spacing.lg,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    step: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginRight: 15 },
    line: { width: 2, height: 30, backgroundColor: '#eee', marginLeft: 5, marginVertical: 5 },
    stepLabel: { fontSize: 10, fontWeight: 'bold', color: colors.gray, letterSpacing: 0.5 },
    stationName: { fontSize: 18, fontWeight: 'bold', color: colors.grayDark },
    distText: { fontSize: 12, color: colors.gray },
    btnMaps: {
        marginTop: 20,
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    btnMapsText: { color: '#fff', fontWeight: 'bold' },
    sectionTitle: { marginHorizontal: spacing.lg, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginHorizontal: spacing.lg,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    listName: { fontWeight: '500' },
    listDist: { color: colors.primary, fontWeight: 'bold' }
});