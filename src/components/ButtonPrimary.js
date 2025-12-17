import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles";

export default function ButtonPrimary({ title, onPress, style, disabled }) {
    return (
        <TouchableOpacity
        onPress={onPress}
        style={[styles.button, style, disabled && styles.disabled]}
        activeOpacity={0.8}
        disabled={disabled}
        >
        <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
    }

    const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: colors.white,
        fontSize: typography.md,
        fontWeight: "bold",
    },
    disabled: {
        backgroundColor: colors.gray,
    },
});

