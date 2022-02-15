import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function homeDriveGetFiles(username: string) {
    const token = await AsyncStorage.getItem('token');
    return fetch(BACKEND_URL + "/userfiles/" + username, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
}