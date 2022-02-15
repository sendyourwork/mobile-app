import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface FileFromDocumentPicker {
    type: "cancel" | "success" | "error",
    name: string,
    size: number,
    mimeType: string,
    uri: string
}

export default async function homeDriveUpload(file: FileFromDocumentPicker) {
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(file.uri);
    const blob = await response.blob();

    const data = new FormData();
    data.append('files', blob, file.name)
    
    // const uri = FileSystem.documentDirectory + file.name;
    // await FileSystem.copyAsync({
    //     from: file.uri,
    //     to: uri
    // })
    const res = await fetch(BACKEND_URL + "/userfiles", {
        method: 'post',
        headers: { "Authorization": "Bearer " + token },
        body: data
    }
        // uri,
        // {
        //     headers: { "Authorization": "Bearer " + token },
        //     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        //     fieldName: "files"
        // }
    )
    
    return JSON.parse(res.body);
}