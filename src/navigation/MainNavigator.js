import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/Main/HomeScreen";
import FavoritesScreen from "../screens/Main/FavoritesScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";
import ExploreNavigator from "./ExploreNavigator";

import { colors } from "../styles";

const Tab = createBottomTabNavigator();

const icons = {
    Home: "home",
    Explore: "search",
    Favorites: "heart",
    Profile: "person",
};
const PantallaPrueba = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Pantalla de prueba</Text>
    </View>
);

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors?.primary || "#007AFF",
                tabBarInactiveTintColor: colors?.inactive || "#8E8E93",
                tabBarStyle: {
                    backgroundColor: colors?.surface || "#FFFFFF",
                    height: 60,
                },
                tabBarIcon: ({ color, size }) => {
                    const iconName = icons[route.name];
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Explore" component={ExploreNavigator} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}