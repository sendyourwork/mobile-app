import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function classDriveFileRemove(filename: string, school_class: string, subject: string) {
    const token = await AsyncStorage.getItem('token');
    return fetch(BACKEND_URL + '/files/' + school_class + '/' + subject + '/' + filename, {
        method:'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
        },
    })
    .then(response => response.text())
}