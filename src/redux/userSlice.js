import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../api/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import Toast from 'react-native-toast-message';
import { saveUserSession, deleteUserSession } from "../api/sqlite"; 

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

            saveUserSession(uid, email, name, '', cardCode); 

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
            
            if (!snapshot.exists()) throw new Error("Datos de usuario no encontrados");
            
            const data = snapshot.val();
            const userData = { uid, ...data };

            saveUserSession(uid, email, data.name || '', '', data.cardCode || '');

            return userData;
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
            signOut(auth); 
            deleteUserSession(); 
            
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
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                Toast.show({ type: 'success', text1: '¡Bienvenido!' });
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                Toast.show({ type: 'success', text1: 'Sesión iniciada' });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                Toast.show({ type: 'error', text1: 'Error', text2: action.payload });
            })
            .addCase(rechargeSaldo.fulfilled, (state, action) => {
                if (state.user) state.user.saldo = action.payload.newSaldo;
            });
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;