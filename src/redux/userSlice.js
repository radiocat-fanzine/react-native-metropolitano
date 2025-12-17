import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../api/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Añadido signOut
import { ref, set, get } from "firebase/database";
import Toast from 'react-native-toast-message'; // Importación necesaria

/* REGISTRO */
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const cardCode = Math.floor(10000000 + Math.random() * 90000000).toString();

            const userData = { uid, name, email, cardCode, saldo: 0 };
            await set(ref(db, `users/${uid}`), userData);
            return userData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/* LOGIN */
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const snapshot = await get(ref(db, `users/${uid}`));
            return { uid, ...snapshot.val() };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/* RECARGA */
export const rechargeSaldo = createAsyncThunk(
    "user/rechargeSaldo",
    async ({ uid, amount }, { rejectWithValue }) => {
        try {
            const userRef = ref(db, `users/${uid}`);
            const snapshot = await get(userRef);

            if (!snapshot.exists()) throw new Error("Usuario no encontrado");

            const userData = snapshot.val();
            const newSaldo = (userData.saldo || 0) + amount;

            await set(userRef, { ...userData, saldo: newSaldo });
            return { newSaldo, amount };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        logout(state) {
            signOut(auth); // Cierra sesión en Firebase
            state.user = null;
            Toast.show({
                type: 'info',
                text1: 'Sesión cerrada',
                position: 'bottom'
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Registro
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                Toast.show({
                    type: 'success',
                    text1: '¡Bienvenido!',
                    text2: 'Cuenta creada exitosamente.'
                });
            })
            // Login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                Toast.show({
                    type: 'success',
                    text1: 'Sesión iniciada',
                    text2: `Hola de nuevo, ${action.payload.name}`
                });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                Toast.show({
                    type: 'error',
                    text1: 'Error de acceso',
                    text2: 'Credenciales incorrectas.'
                });
            })
            // Recarga
            .addCase(rechargeSaldo.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.saldo = action.payload.newSaldo;
                }
                Toast.show({
                    type: 'success',
                    text1: '¡Recarga exitosa!',
                    text2: `Se han añadido S/ ${action.payload.amount}.00 a tu saldo`,
                    position: 'bottom'
                });
            });
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;