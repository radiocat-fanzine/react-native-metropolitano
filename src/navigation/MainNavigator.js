import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function MainNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors?.primary || "#007AFF",
                tabBarInactiveTintColor: colors?.inactive || "#8E8E93",
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: colors?.surface || "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    height: insets.bottom > 0 ? 65 + insets.bottom : 75, 
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
                    paddingTop: 10,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    paddingBottom: 2,
                },
                tabBarIcon: ({ color, size }) => {
                    const iconName = icons[route.name];
                    return (
                        <View style={{ marginTop: 2 }}>
                            <Ionicons name={iconName} size={size} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ tabBarLabel: "Inicio" }} 
            />
            <Tab.Screen 
                name="Explore" 
                component={ExploreNavigator} 
                options={{ tabBarLabel: "Explorar" }}
            />
            <Tab.Screen 
                name="Favorites" 
                component={FavoritesScreen} 
                options={{ tabBarLabel: "Favoritos" }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ tabBarLabel: "Perfil" }}
            />
        </Tab.Navigator>
    );
}