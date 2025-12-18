import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../styles/colors";
import spacing from "../../../styles/spacing";
import typography from "../../../styles/typography";
import globalStyles from "../../../styles/globalStyles";

// Recibimos los datos y funciones desde ExploreScreen
export default function SearchForm({ 
    origin, 
    destination, 
    onSwap, 
    isFastestRoute, 
    setIsFastestRoute,
    originData,      // Objeto completo {description, coords}
    destinationData  // Objeto completo {description, coords}
}) {
    const navigation = useNavigation();

    const handleSearch = () => {
        if (origin === "Desde" || destination === "Hacia") {
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
                    {/* Botón de Origen */}
                    <TouchableOpacity 
                        style={styles.input} 
                        onPress={() => navigation.navigate("LocationSearch", { type: 'origin' })}
                    >
                        <Text 
                            style={[styles.placeholder, origin !== "Desde" && styles.activeText]} 
                            numberOfLines={1}
                        >
                            {origin}
                        </Text>
                    </TouchableOpacity>

                    {/* Botón de Destino */}
                    <TouchableOpacity 
                        style={styles.input}
                        onPress={() => navigation.navigate("LocationSearch", { type: 'destination' })}
                    >
                        <Text 
                            style={[styles.placeholder, destination !== "Hacia" && styles.activeText]} 
                            numberOfLines={1}
                        >
                            {destination}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Swap Real */}
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
                <Text style={styles.searchText}>Buscar</Text>
            </TouchableOpacity>

            <View style={globalStyles.separator} />

            {/* Sección de Favoritos */}
            <Text style={styles.sectionTitle}>Favoritos</Text>
            
            <TouchableOpacity style={styles.recentItem}>
                <Text style={styles.recentText}>⭐ Casa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
                <Text style={styles.recentText}>⭐ Trabajo</Text>
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
        borderRadius: 10,
        marginVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.grayLight,
        height: 55,
        justifyContent: 'center'
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
        color: colors.black || '#000',
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
        borderRadius: 10,
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
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xl,
        elevation: 2,
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
        color: colors.grayDark,
    },
});