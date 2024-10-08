import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function homeDriveFileRemove(name: string, username: string) {
    const token = await AsyncStorage.getItem('token');
    return fetch(BACKEND_URL + "/userfiles/" + username + "/" + name, {
        method:'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
        },
    })
    .then(response => response.text())
}