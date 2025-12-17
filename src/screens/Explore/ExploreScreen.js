import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchForm from "./components/SearchForm";
import globalStyles from "../../styles/globalStyles";

export default function ExploreScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={globalStyles.screen}
                contentContainerStyle={{ paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <View>
                    <SearchForm />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}