import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userSlice";

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
            placeholder="Correo"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
        />

        <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>{loading ? "Cargando..." : "Ingresar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Crear cuenta</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    btn: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    btnText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
    link: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#007bff" },
    error: { color: "red", marginBottom: 10 },
});
