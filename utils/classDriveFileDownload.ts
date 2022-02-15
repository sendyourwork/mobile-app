import { BACKEND_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default async function classDriveFileDownload(filename: string, school_class: string, subject: string) {
    const token = await AsyncStorage.getItem('token');
    const file = await FileSystem.downloadAsync(
        BACKEND_URL + '/files/' + school_class + '/' + subject + '/' + filename,
        FileSystem.documentDirectory + filename,
        {
            headers: {"Authorization": "Bearer " + token}
        },
      )
    try {
        const asset = await MediaLibrary.createAssetAsync(file.uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        alert('Successfully saved file!')
    }
    catch(err) {
        alert(err);
    }
}