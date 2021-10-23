import { BACKEND_URL } from "../config";
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default async function homeDriveFileDownload(filename: string, username: string) {
    const token = await SecureStore.getItemAsync('token');
    const file = await FileSystem.downloadAsync(
        BACKEND_URL + '/userfiles/' + username + '/' + filename,
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