import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const user = useSelector((state) => state.user.user);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Flujo Principal (Home)
                    <Stack.Screen name="MainFlow" component={MainNavigator} />
                ) : (
                    // Flujo de autenticacion (Login)
                    <Stack.Screen name="AuthFlow" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}