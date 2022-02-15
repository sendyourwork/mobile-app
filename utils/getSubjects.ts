import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getSubjects(school_class: string) {
    const token = await AsyncStorage.getItem('token');
    return fetch(BACKEND_URL + "/subjects/" + school_class, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
}