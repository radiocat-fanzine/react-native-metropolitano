import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../api/firebase";
import { ref, onValue } from "firebase/database";

import ButtonPrimary from "../../components/ButtonPrimary";
import { rechargeSaldo } from "../../redux/userSlice";
import { colors, spacing } from "../../styles";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [saldo, setSaldo] = useState(0);
    const [cardCode, setCardCode] = useState("---- ----");
    const [loading, setLoading] = useState(true);

    const PRECIO_ALIMENTADOR = 2.4;
    const PRECIO_METRO = 3.2;

    useEffect(() => {
        if (!user?.uid) return;

        const userRef = ref(db, `users/${user.uid}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSaldo(data.saldo !== null ? data.saldo : 0);
                setCardCode(data.cardCode || user?.cardCode || "---- ----");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleRecharge = () => {
        if (!user?.uid) return;
        dispatch(rechargeSaldo({ uid: user.uid, amount: 10 }));
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const firstName = user?.name ? user.name.split(" ")[0] : "Usuario";

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
            >
                
                {/* SALUDO PERSONALIZADO */}
                <View style={styles.welcomeHeader}>
                    <Text style={styles.greetingText}>Todo listo para tu viaje, {firstName}</Text>
                    <Text style={styles.subtitleText}>Asegúrate de tener saldo suficiente.</Text>
                </View>

                <Text style={styles.sectionTitle}>Metropolitano Card</Text>

                {/* TARJETA */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardBrand}>METROPOLITANO DE LIMA</Text>
                        <View style={styles.chip} />
                    </View>
                    
                    <Text style={styles.cardCode}>{cardCode}</Text>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.balanceLabel}>Saldo disponible</Text>
                            <Text style={styles.balanceAmount}>S/. {Number(saldo).toFixed(2)}</Text>
                        </View>
                        <View style={styles.logoCircle} />
                    </View>
                </View>

                {/* VIAJES DISPONIBLES */}
                <Text style={styles.sectionTitle}>Viajes disponibles</Text>
                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Bus alimentador</Text>
                        <Text style={styles.bold}>{Math.floor(saldo / PRECIO_ALIMENTADOR)} viajes</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Metropolitano</Text>
                        <Text style={styles.bold}>{Math.floor(saldo / PRECIO_METRO)} viajes</Text>
                    </View>
                </View>

                {/* RECARGA */}
                <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>¿Te falta saldo? Recarga aquí</Text>
                
                <ButtonPrimary
                    title="Recargar S/ 10"
                    onPress={handleRecharge}
                    textStyle={{ fontSize: 20, letterSpacing: 1 }} 
                    style={{ marginTop: spacing.md, height: 60, borderRadius: 15 }}
                />
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { padding: spacing.lg },
    loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
    
    welcomeHeader: { marginBottom: spacing.xl },
    greetingText: { fontSize: 20, fontWeight: "bold", color: colors.text },
    subtitleText: { fontSize: 14, color: colors.textSecondary || "#666", marginTop: 4 },
    
    sectionTitle: { fontSize: 20, fontWeight: "600", paddingLeft: spacing.sm,marginBottom: spacing.md, color: colors.text, opacity: 0.7 },

    card: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 24,
        marginBottom: spacing.xl,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        height: 200,
        justifyContent: "space-between",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardBrand: { color: colors.white, fontSize: 12, fontWeight: "bold", opacity: 0.8, letterSpacing: 1 },
    chip: { width: 40, height: 30, backgroundColor: "#FFD700", borderRadius: 6, opacity: 0.8 },
    cardCode: { color: colors.white, fontSize: 20, fontWeight: "bold", letterSpacing: 4, textAlign: "center" },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    balanceLabel: { color: colors.white, fontSize: 12, opacity: 0.8 },
    balanceAmount: { color: colors.white, fontSize: 28, fontWeight: "bold" },
    logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, opacity: 0.2 },

    infoBox: {
        backgroundColor: colors.surface || "#fff",
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border || "#f0f0f0",
        elevation: 2,
    },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 10 },
    infoText: { fontSize: 15, color: colors.textSecondary || "#666" },
    bold: { fontWeight: "bold", color: colors.primary, fontSize: 16 },
    
    buttonTextLarge: {
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    rechargeButtonStyle: {
        marginTop: spacing.md, 
        borderRadius: 15,
        height: 55,
        justifyContent: 'center',
    },
});