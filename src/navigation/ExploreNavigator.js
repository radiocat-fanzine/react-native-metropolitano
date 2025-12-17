import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExploreScreen from "../screens/Explore/ExploreScreen";
import StationsScreen from "../screens/Explore/StationsScreen";
import RouteDetailScreen from "../screens/Explore/RouteDetailScreen";

const Stack = createNativeStackNavigator();

export default function ExploreNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="ExploreMain"
                component={ExploreScreen}
                options={{ title: "Explora" }}
            />
            <Stack.Screen
                name="Stations"
                component={StationsScreen}
                options={{ title: "Estaciones" }}
            />
            <Stack.Screen
                name="RouteDetail"
                component={RouteDetailScreen}
                options={{ title: "Detalle de Ruta" }}
            />
        </Stack.Navigator>
    );
}
