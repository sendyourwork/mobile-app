import { BACKEND_URL } from "../config";
import * as SecureStore from 'expo-secure-store'

export default async function homeDriveGetFiles(username: string) {
    const token = await SecureStore.getItemAsync('token');
    return fetch(BACKEND_URL + "/userfiles/" + username, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
}