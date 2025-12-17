import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

export default function AppNavigator() {
    const user = useSelector((state) => state.user.user);

    return (
        <NavigationContainer>
            {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

