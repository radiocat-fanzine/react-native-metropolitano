import { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Image, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    TouchableOpacity 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import { colors, spacing } from "../../styles";

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
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../../assets/images/LogoMetropolitano_c.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Crea tu cuenta</Text>
                <Text style={styles.subtitle}>Personaliza tu experiencia y viaja sin demoras</Text>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Nombre completo</Text>
                    <TextInput
                        placeholder="Tu nombre"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />

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
                        placeholder="Mínimo 6 caracteres"
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
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.link}>Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: colors.white || "#fff" 
    },
    scrollContainer: { 
        paddingHorizontal: spacing.lg, 
        paddingBottom: spacing.xl,
        paddingTop: Platform.OS === 'ios' ? 30 : 20, 
        flexGrow: 1,
        justifyContent: "center" 
    },
    logoContainer: { 
        alignItems: "center", 
        marginBottom: 20,
        marginTop: 10 
    },
    logo: { 
        width: 110, 
        height: 110 
    },
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
    form: { width: '100%' },
    inputLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#475569",
        marginBottom: 8,
        marginLeft: 4,
        textTransform: "uppercase"
    },
    input: {
        backgroundColor: "#F1F5F9",
        padding: spacing.md,
        borderRadius: 14,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        color: "#1E293B"
    },
    btn: { 
        marginTop: 10,
        height: 55,
        borderRadius: 14,
        justifyContent: 'center'
    },
    errorContainer: {
        backgroundColor: "#FEE2E2",
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#FECACA"
    },
    errorText: { color: "#DC2626", textAlign: "center", fontWeight: "600" },
    footer: { 
        flexDirection: "row", 
        justifyContent: "center", 
        marginTop: 30 
    },
    footerText: { color: "#64748B", fontSize: 15 },
    link: { 
        fontSize: 15, 
        color: colors.primary, 
        fontWeight: "bold" 
    },
});
