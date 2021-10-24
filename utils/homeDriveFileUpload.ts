import { BACKEND_URL } from "../config";
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

interface FileFromDocumentPicker {
    type: "cancel" | "success" | "error",
    name: string,
    size: number,
    uri: string
}

export default async function homeDriveUpload(file: FileFromDocumentPicker) {
    const token = await SecureStore.getItemAsync('token');
    const uri = FileSystem.documentDirectory + file.name;
    await FileSystem.copyAsync({
        from: file.uri,
        to: uri
    })
    const res = await FileSystem.uploadAsync(
        BACKEND_URL + "/userfiles",
        uri,
        {
            headers: { "Authorization": "Bearer " + token },
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "files"
        }
    )
    return JSON.parse(res.body);
}