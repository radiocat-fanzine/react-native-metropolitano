import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { db, auth } from '../../api/firebase';
import { ref, onValue } from "firebase/database";
import { logout } from '../../redux/userSlice';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Referencia a los datos del usuario para saldo y nombre en tiempo real
        const userRef = ref(db, `users/${userId}`);
        const unsub = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.val());
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.mainTitle}>Mi Perfil</Text>

            {/* TARJETA VIRTUAL */}
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardBrand}>Visa Débito</Text>
                    <View style={styles.chip} />
                </View>
                
                <Text style={styles.cardNumber}>
                    {userData?.cardCode ? `**** **** **** ${userData.cardCode.slice(-4)}` : "**** **** **** ****"}
                </Text>
                
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardLabel}>TITULAR</Text>
                        <Text style={styles.cardValue}>{userData?.name?.toUpperCase() || "USUARIO"}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.cardLabel}>SALDO DISPONIBLE</Text>
                        <Text style={styles.cardBalance}>S/ {Number(userData?.saldo || 0).toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* DATOS PERSONALES */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos Personales</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre Completo</Text>
                    <Text style={styles.infoValue}>{userData?.name || "No disponible"}</Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 15 }]}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{userData?.email || auth.currentUser?.email}</Text>
                </View>
            </View>

            {/* MÉTODOS DE PAGO */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Métodos de Pago</Text>
                <TouchableOpacity style={styles.paymentMethod}>
                    <Text style={styles.paymentText}>💳 Visa Débito **** 1234</Text>
                    <Text style={styles.editLink}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addPaymentBtn}>
                    <Text style={styles.addPaymentText}>+ Vincular nueva tarjeta</Text>
                </TouchableOpacity>
            </View>

            {/* BOTÓN CERRAR SESIÓN */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfdfd' },
    content: { padding: spacing.lg, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mainTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, paddingTop: 20, color: '#1a1a1a' },
    
    cardContainer: { 
        backgroundColor: '#2c3e50', 
        height: 190, 
        borderRadius: 20, 
        padding: 25, 
        justifyContent: 'space-between', 
        elevation: 12, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: 35 
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardBrand: { color: '#fff', fontSize: 20, fontWeight: '600', opacity: 0.9 },
    chip: { width: 45, height: 32, backgroundColor: '#e2b044', borderRadius: 6, opacity: 0.9 },
    cardNumber: { color: '#fff', fontSize: 22, letterSpacing: 3, textAlign: 'center', marginVertical: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 },
    cardValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
    cardBalance: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
    infoRow: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
    infoLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 4 },
    infoValue: { fontSize: 16, color: '#333', fontWeight: '500' },
    
    paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
    paymentText: { color: '#444', fontWeight: '500' },
    editLink: { color: colors.primary, fontWeight: '700' },
    addPaymentBtn: { padding: 16, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', alignItems: 'center', marginTop: 5 },
    addPaymentText: { color: colors.primary, fontWeight: '700' },
    
    logoutBtn: { 
        marginTop: 10, 
        padding: 16, 
        alignItems: 'center', 
        borderRadius: 12, 
        borderWidth: 1.5, 
        borderColor: '#ddd',
        backgroundColor: '#fff' 
    },
    logoutText: { color: '#666', fontWeight: '700', fontSize: 16 },
});