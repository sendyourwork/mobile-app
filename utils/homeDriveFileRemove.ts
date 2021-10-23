import { BACKEND_URL } from "../config";
import * as SecureStore from 'expo-secure-store'

export default async function homeDriveFileRemove(name: string, username: string) {
    const token = await SecureStore.getItemAsync('token');
    return fetch(BACKEND_URL + "/upload/" + username + "/" + name, {
        method:'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
        },
    })
    .then(response => response.text())
}