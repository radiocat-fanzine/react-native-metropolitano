import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

export default function LocationSearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { mode } = route.params;

    const title =
        mode === "origin"
            ? "Selecciona tu punto de partida"
            : "Selecciona tu destino";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <GooglePlacesAutocomplete
                placeholder="Escribe una dirección"
                fetchDetails
                onPress={(data, details = null) => {
                    navigation.navigate("ExploreMain", {
                        selectedLocation: {
                            mode,
                            description: data.description,
                            location: details?.geometry?.location,
                        },
                    });
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: "es",
                    components: "country:pe",
                }}
                styles={{
                    textInput: styles.input,
                    listView: styles.list,
                }}
                enablePoweredByContainer={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: spacing.md,
        color: colors.textPrimary,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: spacing.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },
    list: {
        marginTop: spacing.sm,
    },
});
