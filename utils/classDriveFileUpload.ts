import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface FileFromDocumentPicker {
    type: "cancel" | "success" | "error",
    name: string,
    size: number,
    uri: string
}

export default async function classDriveUpload(file: FileFromDocumentPicker, school_class: string, subject: string) {
    const token = await AsyncStorage.getItem('token');
    const uri = FileSystem.documentDirectory + file.name;
    await FileSystem.copyAsync({
        from: file.uri,
        to: uri
    })
    const res = await FileSystem.uploadAsync(
        BACKEND_URL + '/files/' + school_class + '/' + subject,
        uri,
        {
            headers: { "Authorization": "Bearer " + token },
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "files"
        }
    )    
    return JSON.parse(res.body);
}