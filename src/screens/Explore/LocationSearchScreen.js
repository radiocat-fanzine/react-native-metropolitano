import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GOOGLE_PLACES_API_KEY } from "@env"; 

import colors from "../../styles/colors";
import spacing from "../../styles/spacing";

export default function LocationSearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { type } = route.params || {}; 

    const title =
        type === "origin"
            ? "Selecciona tu punto de partida"
            : "Selecciona tu destino";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <GooglePlacesAutocomplete
                placeholder="Escribe una estación o dirección"
                fetchDetails={true}
                onPress={(data, details = null) => {
                    console.log(data, details);
                    navigation.navigate("ExploreMain", {
                        selectedLocation: {
                            type, 
                            description: data.description,
                            location: details?.geometry?.location,
                        },
                    });
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: "es",
                    components: "country:pe",
                    types: 'geocode',
                }}
                nearbyPlacesAPI="GooglePlacesSearch" 
                debounce={400}

                onFail={(error) => console.log("DETALLE ERROR GOOGLE:", error)}
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
        fontSize: 18,
        fontWeight: "700",
        marginBottom: spacing.md,
        color: colors.textPrimary || '#333',
        marginTop: spacing.sm,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 10,
        height: 55,        paddingHorizontal: spacing.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.grayLight,
        color: '#000',
    },
    list: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginTop: spacing.sm,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
});
