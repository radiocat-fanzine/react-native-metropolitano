import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { db, auth } from '../../api/firebase';
import { ref, onValue } from "firebase/database";
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

export default function ProfileScreen() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const userRef = ref(db, `users/${userId}`);
        const unsub = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) setUserData(snapshot.val());
        });

        return () => unsub();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.mainTitle}>Mi Perfil</Text>

            {/* TARJETA VIRTUAL */}
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardBrand}>Metropolitano</Text>
                    <View style={styles.chip} />
                </View>
                <Text style={styles.cardNumber}>
                    {userData?.cardCode ? `**** **** **** ${userData.cardCode.slice(-4)}` : "**** **** **** ****"}
                </Text>
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardLabel}>TITULAR</Text>
                        <Text style={styles.cardValue}>{userData?.name || "Usuario"}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.cardLabel}>SALDO DISPONIBLE</Text>
                        <Text style={styles.cardBalance}>S/ {userData?.saldo || "0.00"}</Text>
                    </View>
                </View>
            </View>

            {/* DATOS PERSONALES */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos Personales</Text>
                <View style={styles.infoRow}>
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

            <TouchableOpacity style={styles.logoutBtn} onPress={() => auth.signOut()}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: spacing.lg },
    mainTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, paddingTop: 20 },
    cardContainer: { backgroundColor: colors.primary, height: 190, borderRadius: 15, padding: 20, justifyContent: 'space-between', elevation: 8, marginBottom: 30 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardBrand: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic' },
    chip: { width: 40, height: 30, backgroundColor: '#D4AF37', borderRadius: 5, opacity: 0.8 },
    cardNumber: { color: '#fff', fontSize: 20, letterSpacing: 2, textAlign: 'center' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
    cardValue: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    cardBalance: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.grayDark, marginBottom: 15 },
    infoRow: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    infoLabel: { fontSize: 12, color: colors.gray },
    infoValue: { fontSize: 16, color: colors.black },
    paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f8f9fa', borderRadius: 10, marginBottom: 10 },
    editLink: { color: colors.primary, fontWeight: 'bold' },
    addPaymentBtn: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed', alignItems: 'center' },
    addPaymentText: { color: colors.primary, fontWeight: 'bold' },
    logoutBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
    logoutText: { color: 'red', fontWeight: 'bold' }
});