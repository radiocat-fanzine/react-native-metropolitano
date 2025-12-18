import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { saveFavorite, subscribeToFavorites, deleteFavorite } from '../../services/favoriteService';
import { GOOGLE_PLACES_API_KEY } from "@env"; 
import colors from '../../styles/colors';

export default function FavoritesScreen({ navigation, route }) {
    const placesRef = useRef();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState(null);

    const [listViewDisplayed, setListViewDisplayed] = useState('auto');

    useEffect(() => {
        if (route.params?.selectedLocation) {
            const { address, latitude, longitude, returnedName } = route.params.selectedLocation;
            
            setIsAdding(true);

            if (returnedName) {
                setNewName(returnedName);
            }

            setNewAddress({
                description: address,
                coords: { lat: latitude, lng: longitude }
            });

            setTimeout(() => {
                if (placesRef.current) {
                    placesRef.current.setAddressText(address);
                    setListViewDisplayed('none');
                }
            }, 600);
        }
    }, [route.params?.selectedLocation]);

    useEffect(() => {
        const unsubscribe = subscribeToFavorites((list) => {
            setFavorites(list);
            setLoading(false);
        });
        return () => unsubscribe(); 
    }, []);

    const handleSave = async () => {
        if (!newName.trim() || !newAddress) {
            Alert.alert("Atención", "Ingresa un nombre y selecciona una dirección.");
            return;
        }
        try {
            await saveFavorite(newName, newAddress.description, newAddress.coords);
            resetForm();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar.");
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setNewName('');
        setNewAddress(null);
        setListViewDisplayed('auto');
        placesRef.current?.setAddressText("");
        Keyboard.dismiss();
        navigation.setParams({ selectedLocation: undefined });
    };

    const handleOpenMap = () => {
        navigation.navigate('MapPickerScreen', {
            initialLocation: newAddress ? {
                latitude: newAddress.coords.lat,
                longitude: newAddress.coords.lng
            } : null,
            origin: 'Favorites',
            existingName: newName 
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Mis Favoritos</Text>
                
                {!isAdding ? (
                    <TouchableOpacity style={styles.addCardBtn} onPress={() => setIsAdding(true)}>
                        <View style={styles.addIconContainer}><Text style={styles.addPlusText}>+</Text></View>
                        <Text style={styles.addBtnLabel}>Agregar nueva dirección</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Agregar nueva dirección</Text>
                        
                        <TextInput 
                            style={styles.input}
                            placeholder="Nombre (Ej: Oficina)"
                            value={newName}
                            onChangeText={setNewName}
                            placeholderTextColor="#999"
                        />

                        <View style={styles.searchWrapper}>
                            <GooglePlacesAutocomplete
                                ref={placesRef}
                                placeholder='Buscar dirección...'
                                fetchDetails={true}
                                debounce={200}
                                onPress={(data, details = null) => {
                                    const address = data.description || data.formatted_address;
                                    setNewAddress({
                                        description: address,
                                        coords: {
                                            lat: details.geometry.location.lat,
                                            lng: details.geometry.location.lng
                                        }
                                    });
                                    placesRef.current?.setAddressText(address);
                                    setListViewDisplayed('none'); 
                                    Keyboard.dismiss();
                                }}
                                textInputProps={{
                                    onChangeText: (text) => {
                                        if (text.length > 0) {
                                            if (listViewDisplayed !== 'auto') setListViewDisplayed('auto');
                                        }
                                    },
                                    onFocus: () => setListViewDisplayed('auto')
                                }}
                                query={{ 
                                    key: GOOGLE_PLACES_API_KEY, 
                                    language: 'es', 
                                    components: 'country:pe',
                                    types: 'address',
                                    location: '-12.046374,-77.042793', 
                                    radius: '50000', 
                                    strictbounds: true, 
                                }}
                                styles={{
                                    textInput: styles.searchInput,
                                    listView: [styles.googleListView, { display: listViewDisplayed }],
                                }}
                                enablePoweredByContainer={false}
                                minLength={2}
                            />
                        </View>

                        {/* Botón del mapa */}
                        <TouchableOpacity 
                            style={styles.mapOption} 
                            onPress={handleOpenMap}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.mapOptionText}>📍 Seleccionar desde el mapa</Text>
                        </TouchableOpacity>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                                <Text style={styles.cancelBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.saveBtn, (!newName || !newAddress) && styles.saveBtnDisabled]} 
                                onPress={handleSave}
                                disabled={!newName || !newAddress}
                            >
                                <Text style={styles.saveBtnText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.favCard}>
                                <View style={styles.iconCircle}><Text style={{fontSize: 18}}>⭐</Text></View>
                                <View style={styles.favInfo}>
                                    <Text style={styles.favName}>{item.name}</Text>
                                    <Text style={styles.favAddress} numberOfLines={1}>{item.address}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteFavorite(item.id)}>
                                    <Text style={styles.deleteText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No hay favoritos.</Text>}
                        keyboardShouldPersistTaps="always"
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    innerContainer: { flex: 1, padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
    addCardBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        padding: 16, borderRadius: 16, marginBottom: 20,
        borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed',
    },
    addIconContainer: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    addPlusText: { color: colors.primary, fontSize: 20, fontWeight: 'bold' },
    addBtnLabel: { color: colors.primary, fontWeight: '600', fontSize: 15 },
    formContainer: {
        backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20,
        elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, zIndex: 5000, 
    },
    formTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15, color: '#334155' },
    input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 12, color: '#000' },
    searchWrapper: { zIndex: 10000, marginBottom: 10, minHeight: 50 },
    searchInput: { backgroundColor: '#F1F5F9', borderRadius: 10, color: '#000', height: 45 },
    googleListView: { 
        backgroundColor: '#FFF', position: 'absolute', top: 45, width: '100%',
        zIndex: 10000, elevation: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' 
    },
    mapOption: { paddingVertical: 12, marginBottom: 10, alignSelf: 'flex-start' },
    mapOptionText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 5 },
    cancelBtn: { padding: 10 },
    cancelBtnText: { color: '#64748B', fontWeight: '600' },
    saveBtn: { backgroundColor: colors.primary, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10 },
    saveBtnDisabled: { backgroundColor: '#CBD5E1' },
    saveBtnText: { color: '#FFF', fontWeight: 'bold' },
    favCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9'
    },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    favInfo: { flex: 1 },
    favName: { fontWeight: 'bold', fontSize: 15, color: '#1E293B' },
    favAddress: { color: '#64748B', fontSize: 12 },
    deleteText: { fontSize: 18, padding: 5 },
    emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 20 }
});