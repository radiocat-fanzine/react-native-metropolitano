import { db, auth } from "../api/firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

// Guardar un nuevo favorito
export const saveFavorite = async (name, address, coords) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const favRef = ref(db, `users/${userId}/favorites`);
    const newFavRef = push(favRef); 
    
    return set(newFavRef, {
        name,
        address,
        lat: coords.lat,
        lng: coords.lng
    });
};

// Suscripción en tiempo real
export const subscribeToFavorites = (callback) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};

    const favRef = ref(db, `users/${userId}/favorites`);
    return onValue(favRef, (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        callback(list);
    });
};

// Eliminar un favorito
export const deleteFavorite = async (favId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const favRef = ref(db, `users/${userId}/favorites/${favId}`);
    return remove(favRef);
};