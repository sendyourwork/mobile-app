import { BACKEND_URL } from "../config";
import * as SecureStore from "expo-secure-store"

export default async function getChatMessages(school_class: string) {
    const token = await SecureStore.getItemAsync('token');
    return fetch(`${BACKEND_URL}/chat/${school_class}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
}