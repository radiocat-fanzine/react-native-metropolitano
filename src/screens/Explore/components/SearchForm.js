import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../styles/colors";
import spacing from "../../../styles/spacing";
import typography from "../../../styles/typography";
import globalStyles from "../../../styles/globalStyles";

export default function SearchForm() {
    const navigation = useNavigation();
    
    const [isFastestRoute, setIsFastestRoute] = useState(false);
    const [origin, setOrigin] = useState("Desde");
    const [destination, setDestination] = useState("Hacia");

    // Función para intercambiar origen y destino
    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    return (
        <View style={styles.container}>
            {/* Título */}
            <Text style={[typography.title, styles.mainTitle]}>¿A dónde vas?</Text>
            
            {/* Contenedor de Inputs con Swap real */}
            <View style={styles.inputsWrapper}>
                <View style={styles.inputsColumn}>
                    <TouchableOpacity 
                        style={styles.input} 
                        onPress={() => navigation.navigate("LocationSearch", { type: 'origin' })}
                    >
                        <Text style={styles.placeholder}>{origin}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.input}
                        onPress={() => navigation.navigate("LocationSearch", { type: 'destination' })}
                    >
                        <Text style={styles.placeholder}>{destination}</Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Swap */}
                <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                    <Text style={styles.swapIcon}>⇅</Text>
                </TouchableOpacity>
            </View>

            {/* Fecha */}
            <TouchableOpacity style={styles.datePicker}>
                <Text style={styles.placeholder}>📅 Fecha y hora</Text>
            </TouchableOpacity>

            {/* Toggle */}
            <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Mostrar ruta más rápida</Text>
                <Switch
                    trackColor={{ false: colors.grayLight, true: colors.primary + "80" }}
                    thumbColor={isFastestRoute ? colors.primary : "#f4f3f4"}
                    onValueChange={() => setIsFastestRoute(previousState => !previousState)}
                    value={isFastestRoute}
                />
            </View>

            {/* Buscar */}
            <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => navigation.navigate("Stations", { origin, destination, isFastestRoute })}
            >
                <Text style={styles.searchText}>Buscar</Text>
            </TouchableOpacity>

            <View style={globalStyles.separator} />

            {/* Favoritos */}
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
        padding: spacing.md,
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
        width: 36,
        height: 36,
        borderRadius: 18,
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
    datePicker: {
        backgroundColor: colors.white,
        padding: spacing.md,
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
        padding: spacing.md,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    searchText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
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