import { View, Text, StyleSheet } from "react-native";

export default function LocationInput({ placeholder = "Lugar" }) {
    return (
        <View style={styles.container}>
            <Text>{placeholder}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});
