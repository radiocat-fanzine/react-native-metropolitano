import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../api/firebase';
import { ref, onValue } from "firebase/database";
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        // Referencia a favoritos en Realtime Database
        const favRef = ref(db, `users/${userId}/favorites`);
        
        const unsub = onValue(favRef, (snapshot) => {
            const data = snapshot.val();
            const list = data ? Object.keys(data).map(key => ({ 
                id: key, 
                ...data[key] 
            })) : [];
            
            setFavorites(list);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    // Lógica para asignar iconos según nombre
    const getIcon = (name) => {
        const lowerName = (name || "").toLowerCase();
        if (lowerName.includes('casa') || lowerName.includes('home')) return '🏠';
        if (lowerName.includes('trabajo') || lowerName.includes('work') || lowerName.includes('oficina')) return '💼';
        return '⭐'; // Icono por defecto
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.favCard}
            onPress={() => console.log("Seleccionado:", item.name)}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.favIcon}>{getIcon(item.name)}</Text>
            </View>
            
            <View style={styles.favInfo}>
                <Text style={styles.favName}>{item.name}</Text>
                <Text style={styles.favAddress} numberOfLines={1}>{item.address}</Text>
            </View>

            <Text style={styles.arrow}>❯</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Favoritos</Text>
                <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => console.log("Abrir modal para nuevo favorito")}
                >
                    <Text style={styles.addBtnText}>+ Nuevo</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📍</Text>
                    <Text style={styles.emptyText}>Aún no tienes lugares guardados.</Text>
                    <Text style={styles.emptySub}>Guarda tus rutas frecuentes para viajar más rápido.</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: 20,
        paddingBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.grayDark || '#333',
    },
    addBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 2,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 20,
    },
    favCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    favIcon: {
        fontSize: 22,
    },
    favInfo: {
        flex: 1,
    },
    favName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    favAddress: {
        fontSize: 13,
        color: '#757575',
        marginTop: 2,
    },
    arrow: {
        color: '#E0E0E0',
        fontSize: 18,
        marginLeft: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 50,
        marginBottom: 10,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.grayDark,
    },
    emptySub: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.gray,
        marginTop: 8,
    },
});