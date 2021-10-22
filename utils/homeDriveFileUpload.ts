import { BACKEND_URL } from "../config";
import * as SecureStore from 'expo-secure-store';

export default async function homeDriveUpload(files: FormData) {
    const token = await SecureStore.getItemAsync('token');
    return fetch(BACKEND_URL + "/upload", {
        method:'POST',
        headers: {
            "Authorization": "Bearer " + token
        },
        body: files
    })
    .then(response => response.json())
}