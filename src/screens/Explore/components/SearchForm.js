import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../styles/colors";
import spacing from "../../../styles/spacing";
import typography from "../../../styles/typography";
import globalStyles from "../../../styles/globalStyles";

export default function SearchForm({ 
    onSwap, 
    isFastestRoute, 
    setIsFastestRoute,
    originData,     
    destinationData
}) {
    const navigation = useNavigation();

    // Lógica de búsqueda
    const handleSearch = () => {
        if (!originData || !destinationData) {
            Alert.alert("Atención", "Por favor selecciona un punto de origen y un destino.");
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
            {/* Título */}
            <Text style={[typography.title, styles.mainTitle]}>¿A dónde vas?</Text>
            
            {/* Contenedor de Inputs con Swap */}
            <View style={styles.inputsWrapper}>
                <View style={styles.inputsColumn}>
                    
                    {/* Botón de Origen (Desde) */}
                    <TouchableOpacity 
                        style={styles.input} 
                        onPress={() => navigation.navigate("LocationSearch", { type: 'origin' })}
                    >
                        <Text 
                            style={[
                                styles.placeholder, 
                                originData && styles.activeText
                            ]} 
                            numberOfLines={1}
                        >
                            {originData ? originData.description : "Desde"}
                        </Text>
                    </TouchableOpacity>

                    {/* Botón de Destino (Hacia) */}
                    <TouchableOpacity 
                        style={styles.input}
                        onPress={() => navigation.navigate("LocationSearch", { type: 'destination' })}
                    >
                        <Text 
                            style={[
                                styles.placeholder, 
                                destinationData && styles.activeText
                            ]} 
                            numberOfLines={1}
                        >
                            {destinationData ? destinationData.description : "Hacia"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Swap */}
                <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
                    <Text style={styles.swapIcon}>⇅</Text>
                </TouchableOpacity>
            </View>

            {/* Fecha (Simulada) */}
            <TouchableOpacity style={styles.datePicker}>
                <Text style={styles.placeholderText}>📅 Fecha y hora</Text>
            </TouchableOpacity>

            {/* Toggle de Ruta Rápida */}
            <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Mostrar ruta más rápida</Text>
                <Switch
                    trackColor={{ false: colors.grayLight, true: colors.primary + "80" }}
                    thumbColor={isFastestRoute ? colors.primary : "#f4f3f4"}
                    onValueChange={() => setIsFastestRoute(prev => !prev)}
                    value={isFastestRoute}
                />
            </View>

            {/* Botón de Acción Principal */}
            <TouchableOpacity 
                style={styles.searchButton}
                onPress={handleSearch}
            >
                <Text style={styles.searchText}>Buscar Ruta</Text>
            </TouchableOpacity>

            <View style={globalStyles.separator} />

            {/* Sección de Favoritos Rápidos */}
            <Text style={styles.sectionTitle}>Favoritos</Text>
            
            <TouchableOpacity 
                style={styles.recentItem}
                onPress={() => navigation.navigate("Favorites")}
            >
                <Text style={styles.recentText}>⭐ Ir a mis favoritos</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    mainTitle: {
        marginBottom: spacing.md,
    },
    inputsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputsColumn: {
        flex: 1,
    },
    input: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        marginVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.grayLight,
        height: 55,
        justifyContent: 'center',
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    swapButton: {
        position: 'absolute',
        right: 15,
        backgroundColor: colors.primary,
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        zIndex: 10,
        borderWidth: 2,
        borderColor: colors.white,
    },
    swapIcon: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    placeholder: {
        color: colors.gray,
        fontSize: 16,
    },
    activeText: {
        color: colors.black || '#1A1A1A',
        fontWeight: '500',
    },
    placeholderText: {
        color: colors.gray,
        fontSize: 16,
    },
    datePicker: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        height: 50,
        justifyContent: 'center',
        borderRadius: 12,
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },
    toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: spacing.lg,
    },
    toggleText: {
        fontSize: 16,
        color: colors.grayDark,
    },
    searchButton: {
        backgroundColor: colors.primary,
        height: 55,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xl,
        elevation: 3,
    },
    searchText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "700",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.grayDark,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    recentItem: {
        paddingVertical: spacing.md,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.grayLight,
    },
    recentText: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: '500',
    },
});