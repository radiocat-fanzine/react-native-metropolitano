import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";

import { colors, spacing, typography } from "../../styles";

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        dispatch(registerUser({ name, email, password }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TextInput
                placeholder="Nombre"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Correo"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Contraseña"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <ButtonPrimary
                title={loading ? "Cargando..." : "Registrarme"}
                onPress={handleRegister}
                style={styles.btn}
                disabled={loading}
            />

            <Text
                style={styles.link}
                onPress={() => navigation.goBack()}
            >
                Volver al login
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: spacing.lg, justifyContent: "center" },
    title: { fontSize: typography.xl, fontWeight: "bold", marginBottom: spacing.lg },
    input: {
        borderWidth: 1,
        borderColor: colors.grayLight,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
        fontSize: typography.md,
    },
    btn: { marginTop: spacing.md },
    link: { textAlign: "center", marginTop: spacing.lg, fontSize: typography.md, color: colors.primary },
    error: { color: colors.danger, marginBottom: spacing.sm },
});
