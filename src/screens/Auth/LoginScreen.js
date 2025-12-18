import { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    KeyboardAvoidingView, 
    Platform,
    ActivityIndicator 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userSlice";
import colors from "../../styles/colors";

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                {/* LOGO METROPOLITANO */}
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../../assets/images/LogoMetropolitano_c.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Iniciar Sesión</Text>
                <Text style={styles.subtitle}>Ingresa para revisar tu saldo y planear tu próximo viaje</Text>

                {error && <View style={styles.errorContainer}><Text style={styles.error}>{error}</Text></View>}

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Correo electrónico</Text>
                    <TextInput
                        placeholder="ejemplo@correo.com"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <TextInput
                        placeholder="••••••••"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.btn, loading && styles.btnDisabled]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Ingresar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.link}>Crear cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    innerContainer: { flex: 1, padding: 30, justifyContent: "center" },
    logoContainer: { alignItems: "center", marginBottom: 30 },
    logo: { width: 160, height: 160 },
    title: { 
        fontSize: 28, 
        fontWeight: "800", 
        color: "#1E293B", 
        textAlign: "center" 
    },
    subtitle: { 
        fontSize: 15, 
        color: "#64748B", 
        textAlign: "center", 
        marginBottom: 30,
        marginTop: 5 
    },
    inputGroup: { marginBottom: 10 },
    inputLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#475569",
        marginBottom: 8,
        marginLeft: 4,
        textTransform: "uppercase"
    },
    input: {
        backgroundColor: "#F1F5F9",
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        fontSize: 16,
        color: "#1E293B",
        borderWidth: 1,
        borderColor: "#E2E8F0"
    },
    btn: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 14,
        marginTop: 10,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    btnDisabled: { backgroundColor: "#CBD5E1" },
    btnText: { textAlign: "center", color: "#fff", fontWeight: "800", fontSize: 16 },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
    footerText: { color: "#64748B", fontSize: 15 },
    link: { fontSize: 15, color: colors.primary, fontWeight: "bold" },
    errorContainer: {
        backgroundColor: "#FEE2E2",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#FECACA"
    },
    error: { color: "#DC2626", textAlign: "center", fontSize: 14, fontWeight: "600" },
});
