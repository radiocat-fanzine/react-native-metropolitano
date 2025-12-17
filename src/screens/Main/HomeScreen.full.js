import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Añadido para el diseño
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../api/firebase";
import { ref, onValue } from "firebase/database";

import ButtonPrimary from "../../components/ButtonPrimary";
import { rechargeSaldo } from "../../redux/userSlice";
import { colors, spacing, typography } from "../../styles";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true);

    const PRECIO_ALIMENTADOR = 2.4;
    const PRECIO_METRO = 3.2;

    useEffect(() => {
        if (!user?.uid) return;

        const saldoRef = ref(db, `users/${user.uid}/saldo`);

        const unsubscribe = onValue(saldoRef, (snapshot) => {
            const data = snapshot.val();
            setSaldo(data !== null ? data : 0);
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Mi Tarjeta</Text>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Código de tarjeta</Text>
                    <Text style={styles.cardCode}>{user?.cardCode || "---- ----"}</Text>

                    <Text style={styles.balanceLabel}>Saldo disponible</Text>
                    <Text style={styles.balanceAmount}>
                        S/. {Number(saldo).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Bus alimentador:{" "}
                        <Text style={styles.bold}>
                            {Math.floor(saldo / PRECIO_ALIMENTADOR)} viajes
                        </Text>
                    </Text>

                    <Text style={styles.infoText}>
                        Metropolitano:{" "}
                        <Text style={styles.bold}>
                            {Math.floor(saldo / PRECIO_METRO)} viajes
                        </Text>
                    </Text>
                </View>

                <ButtonPrimary
                    title="Recargar S/ 10"
                    onPress={handleRecharge}
                    style={{ marginTop: spacing.xl }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    title: {
        fontSize: typography.lg,
        fontWeight: "bold",
        marginBottom: spacing.md,
        color: colors.text,
    },
    card: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        elevation: 4, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardLabel: {
        color: colors.white,
        fontSize: typography.sm,
        opacity: 0.9,
    },
    cardCode: {
        color: colors.white,
        fontSize: typography.xl,
        fontWeight: "bold",
        letterSpacing: 2,
        marginVertical: spacing.md,
    },
    balanceLabel: {
        color: colors.white,
        fontSize: typography.sm,
    },
    balanceAmount: {
        color: colors.white,
        fontSize: typography.xxl,
        fontWeight: "bold",
    },
    infoBox: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border || "#eee",
    },
    infoText: {
        fontSize: typography.md,
        color: colors.textSecondary || colors.grayDark,
        marginBottom: spacing.sm,
    },
    bold: {
        fontWeight: "bold",
        color: colors.primary,
    },
});