import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../../styles/colors";
import spacing from "../../../styles/spacing";
import typography from "../../../styles/typography";
import globalStyles from "../../../styles/globalStyles";

export default function SearchForm() {
    return (
        <View style={styles.container}>
        {/* Título */}
        <Text style={typography.title}>¿A dónde vas?</Text>
        <View style={globalStyles.separator} />

        {/* Inputs */}
        <View style={styles.inputsContainer}>
            <TouchableOpacity style={styles.input}>
            <Text style={styles.placeholder}>Desde</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.swapButton}>
            <Text style={styles.swapIcon}>⇄</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.input}>
            <Text style={styles.placeholder}>Hacia</Text>
            </TouchableOpacity>
        </View>

        {/* Fecha */}
        <TouchableOpacity style={styles.datePicker}>
            <Text style={styles.placeholder}>📅 Fecha y hora</Text>
        </TouchableOpacity>

        {/* Toggle */}
        <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Mostrar ruta más rápida</Text>
            <View style={styles.toggleFake} />
        </View>

        {/* Buscar */}
        <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>

        <View style={globalStyles.separator} />

        {/* Favoritos recientes */}
        <Text style={styles.sectionTitle}>Usados recientemente</Text>

        <View style={styles.recentItem}>
            <Text style={styles.recentText}>⭐ Favorito 1</Text>
        </View>

        <View style={styles.recentItem}>
            <Text style={styles.recentText}>⭐ Favorito 2</Text>
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        backgroundColor: colors.background,
    },

    inputsContainer: {
        position: "relative",
    },

    input: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 10,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },

    placeholder: {
        color: colors.gray,
        fontSize: 16,
    },

    swapButton: {
        position: "absolute",
        right: spacing.md,
        top: "35%",
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },

    swapIcon: {
        color: colors.white,
        fontSize: 18,
    },

    datePicker: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 10,
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },

    toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: spacing.md,
    },

    toggleText: {
        fontSize: 16,
        color: colors.grayDark,
    },

    toggleFake: {
        width: 48,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.grayLight,
    },

    searchButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: spacing.md,
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
        marginBottom: spacing.sm,
    },

    recentItem: {
        paddingVertical: spacing.sm,
    },

    recentText: {
        fontSize: 15,
        color: colors.grayDark,
    },
});
