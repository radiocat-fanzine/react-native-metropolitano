import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../styles/colors";
import spacing from "../../../styles/spacing";
import typography from "../../../styles/typography";

export default function SearchForm({ 
    onSwap, 
    isFastestRoute, 
    setIsFastestRoute,
    originData,     
    destinationData
}) {
    const navigation = useNavigation();

    const handleSearch = () => {
        if (!originData || !destinationData) {
            Alert.alert("Atención", "Selecciona origen y destino para calcular la mejor ruta.");
            return;
        }

        navigation.navigate("Stations", { 
            origin: originData, 
            destination: destinationData, 
            isFastestRoute 
        });
    };

    return (
        <View style={styles.container}>
            <Text style={[typography.title, styles.mainTitle]}>Planifica tu viaje</Text>
            
            <View style={styles.inputsWrapper}>
                <View style={styles.inputsColumn}>
                    {/* Input Origen */}
                    <TouchableOpacity 
                        style={[styles.input, originData && styles.inputActive]} 
                        onPress={() => navigation.navigate("LocationSearch", { type: 'origin' })}
                    >
                        <Text style={styles.label}>Desde</Text>
                        <Text style={[styles.valueText, originData && styles.activeValue]} numberOfLines={1}>
                            {originData ? originData.description : "Seleccionar origen"}
                        </Text>
                    </TouchableOpacity>

                    {/* Input Destino */}
                    <TouchableOpacity 
                        style={[styles.input, destinationData && styles.inputActive]}
                        onPress={() => navigation.navigate("LocationSearch", { type: 'destination' })}
                    >
                        <Text style={styles.label}>Hacia</Text>
                        <Text style={[styles.valueText, destinationData && styles.activeValue]} numberOfLines={1}>
                            {destinationData ? destinationData.description : "¿A dónde vas?"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Swap */}
                <TouchableOpacity style={styles.swapButton} onPress={onSwap} activeOpacity={0.7}>
                    <Text style={styles.swapIcon}>⇅</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.toggleRow}>
                <View>
                    <Text style={styles.toggleTitle}>⚡ Ruta más rápida</Text>
                    <Text style={styles.toggleSubtitle}>Evita esperas y llega antes a tu destino</Text>
                </View>
                <Switch
                    trackColor={{ false: "#D1D1D1", true: colors.primary + "60" }}
                    thumbColor={isFastestRoute ? colors.primary : "#f4f3f4"}
                    onValueChange={() => setIsFastestRoute(prev => !prev)}
                    value={isFastestRoute}
                />
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchText}>Buscar mejores rutas</Text>
            </TouchableOpacity>

            <View style={styles.footerSection}>
                <Text style={styles.sectionTitle}>⭐ Favoritos</Text>
                <TouchableOpacity 
                    style={styles.recentItem}
                    onPress={() => navigation.navigate("Favorites")}
                >
                    <Text style={styles.recentText}>Guarda tus rutas frecuentes </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.md, backgroundColor: colors.background },
    mainTitle: { marginBottom: spacing.lg, fontSize: 24, fontWeight: '800', color: colors.primary },
    inputsWrapper: { flexDirection: 'row', alignItems: 'center' },
    inputsColumn: { flex: 1 },
    input: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        borderRadius: 16,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        height: 70,
        justifyContent: 'center',
        elevation: 2,
    },
    inputActive: { borderColor: colors.primary + "40", backgroundColor: '#fff' },
    label: { fontSize: 11, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
    valueText: { fontSize: 16, color: '#999' },
    activeValue: { color: '#333', fontWeight: '600' },
    swapButton: {
        position: 'absolute',
        right: 15,
        backgroundColor: colors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        zIndex: 10,
        borderWidth: 3,
        borderColor: colors.white,
    },
    swapIcon: { color: colors.white, fontSize: 22, fontWeight: 'bold' },
    toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 25,
        paddingHorizontal: 5,
    },
    toggleTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
    toggleSubtitle: { fontSize: 16, color: '#888' },
    searchButton: {
        backgroundColor: colors.primary,
        height: 60,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
    searchText: { color: colors.white, fontSize: 18, fontWeight: "800" },
    footerSection: { marginTop: 16 },
    sectionTitle: { fontSize: 20, fontWeight: "700", color: '#333', marginBottom: 16, marginTop: 10 },
    recentItem: { paddingVertical: 16, backgroundColor: '#eeeeeeff', borderRadius: 12, paddingHorizontal: 15 },
    recentText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
});