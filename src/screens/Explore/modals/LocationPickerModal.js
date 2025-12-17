import { View, Text, StyleSheet } from "react-native";

export default function LocationPickerModal({ visible = false }) {
    if (!visible) return null;

    return (
        <View style={styles.modal}>
            <Text>Modal de selección de ubicación</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
});
