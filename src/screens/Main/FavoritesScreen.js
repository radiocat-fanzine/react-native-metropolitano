import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { saveFavorite, subscribeToFavorites, deleteFavorite } from '../../services/favoriteService';

import { GOOGLE_MAPS_API_KEY } from "@env";
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el Modal de creación
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState(null);

    // Escuchar favoritos en tiempo real al cargar la pantalla
    useEffect(() => {
        const unsubscribe = subscribeToFavorites((list) => {
            setFavorites(list);
            setLoading(false);
        });
        return () => unsubscribe(); 
    }, []);

    // Función para guardar
    const handleSave = async () => {
        if (!newName.trim() || !newAddress) {
            Alert.alert("Campos incompletos", "Por favor ingresa un nombre y busca una dirección.");
            return;
        }

        try {
            await saveFavorite(newName, newAddress.description, newAddress.coords);
            setModalVisible(false);
            setNewName('');
            setNewAddress(null);
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la ubicación.");
        }
    };

    // Función para eliminar (se activa con LongPress)
    const confirmDelete = (item) => {
        Alert.alert(
            "Eliminar favorito",
            `¿Estás seguro de que quieres eliminar "${item.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => deleteFavorite(item.id) }
            ]
        );
    };

    const getIcon = (name) => {
        const lowerName = (name || "").toLowerCase();
        if (lowerName.includes('casa') || lowerName.includes('home')) return '🏠';
        if (lowerName.includes('trabajo') || lowerName.includes('work') || lowerName.includes('oficina')) return '💼';
        return '⭐';
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.favCard}
            onPress={() => console.log("Ir a:", item.address)}
            onLongPress={() => confirmDelete(item)} // Borrar al mantener presionado
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
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Mis Favoritos</Text>
                <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addBtnText}>+ Nuevo</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📍</Text>
                    <Text style={styles.emptyText}>No hay lugares guardados</Text>
                    <Text style={styles.emptySub}>Mantén presionada una tarjeta para eliminarla.</Text>
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

            {/* Modal para agregar a favorito */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo Favorito</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeModal}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput 
                            style={styles.input}
                            placeholder="Nombre (ej. Casa)"
                            value={newName}
                            onChangeText={setNewName}
                        />

                        {/* Buscador de Google */}
                        <View style={styles.searchWrapper}>
                            <GooglePlacesAutocomplete
                                placeholder='Buscar dirección en Lima...'
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    setNewAddress({
                                        description: data.description,
                                        coords: {
                                            lat: details.geometry.location.lat,
                                            lng: details.geometry.location.lng
                                        }
                                    });
                                }}
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'es',
                                    components: 'country:pe',
                                    location: '-12.046374, -77.042793', // Centro de Lima
                                    radius: '30000',
                                }}
                                styles={{
                                    textInput: styles.searchInput,
                                    container: { flex: 0 },
                                    listView: { color: '#000', backgroundColor: '#fff', borderRadius: 10 }
                                }}
                                enablePoweredByContainer={false}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.saveBtn, (!newName || !newAddress) && styles.saveBtnDisabled]} 
                            onPress={handleSave}
                            disabled={!newName || !newAddress}
                        >
                            <Text style={styles.saveBtnText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    addBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    addBtnText: { color: '#fff', fontWeight: 'bold' },
    listContent: { paddingHorizontal: spacing.lg, paddingBottom: 20 },
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
        shadowRadius: 4 
    },
    iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    favIcon: { fontSize: 22 },
    favInfo: { flex: 1 },
    favName: { fontSize: 16, fontWeight: '700' },
    favAddress: { fontSize: 13, color: '#757575', marginTop: 2 },
    arrow: { color: '#E0E0E0', fontSize: 18 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyIcon: { fontSize: 50, opacity: 0.3 },
    emptyText: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
    emptySub: { fontSize: 14, color: 'gray', textAlign: 'center', marginTop: 5 },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: 500 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold' },
    closeModal: { color: colors.primary, fontWeight: 'bold' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, marginBottom: 15 },
    searchWrapper: { zIndex: 10, minHeight: 250 },
    searchInput: { backgroundColor: '#f5f5f5', borderRadius: 12, height: 50 },
    saveBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    saveBtnDisabled: { backgroundColor: '#ccc' },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});