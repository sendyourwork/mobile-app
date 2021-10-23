import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components/native"
import * as DocumentPicker from 'expo-document-picker';
import { View,  TouchableOpacity, ActivityIndicator } from "react-native";
import homeDriveUpload from "../utils/homeDriveFileUpload";
import { UserContext } from "../App";
import homeDriveGetFiles from "../utils/homeDriveGetFiles";
import formatFileSize from "../helpers/formatFileSize";
import homeDriveFileRemove from "../utils/homeDriveFileRemove";
import homeDriveFileDownload from "../utils/homeDriveFileDownload";
import * as Permissions from 'expo-permissions';

import { User } from "../interfaces/user";

const MainView = styled.View`
    padding:5px 10px;
`

const StyledButton = styled.TouchableOpacity`
    padding:5px;
    padding-right: 12px;
    background-color: #238638;
    border-radius: 10px;
    align-self: flex-start;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
    position: relative;
`
const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
    margin-left: 3px;
`
const StyledImage = styled.Image`
    width: 20px;
    height: 20px;
`
const Error = styled.Text`
    color: red;
    font-size: 16px;
    padding:5px;
`
const FileContainer = styled.View`
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #222222;
    margin-top: 15px;
    flex-direction: row;
    align-items: center;
`
const FileName = styled.Text`
    color: white;
    font-size: 16px;
`
const FileSize = styled.Text`
    color: gray;
    font-size: 16px;
`
const DownloadButton = styled.TouchableOpacity`
    padding:7px;
    border-radius: 100px;
    background-color: rgb(37, 99, 235);
`
const DownloadImage = styled.Image`
    width: 30px;
    height: 30px;
`
const Files = styled.ScrollView`

`
const RemoveFileText = styled.Text`
    color: rgb(37, 99, 235);
`

const ButtonsView = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const RefreshButton = styled.TouchableOpacity`
    padding:5px;
    border-radius: 10px;
    align-items: center;
    margin-top: 5px;
`
const RefreshImage = styled.Image`
    width: 24px;
    height: 24px;
`

interface FileFromDocumentPicker {
    type: "cancel" | "success" | "error",
    name: string,
    size: number,
    uri: string
}

export default function Drive() {
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const { username } = useContext(UserContext) as User;

    const getFileList = async () => {
        const data = await homeDriveGetFiles(username);
        setFiles(data);
    }

    const addNewFile = async () => {
        const file = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false
        });
        const MAX_SIZE = 1024 * 1024 * 10;
        if(file.type === "success") {
            if((file as FileFromDocumentPicker).size > MAX_SIZE) {
                setError("Your file weights more than 10 MB");
            }
            else {  
                const response = await homeDriveUpload(file);

                if (response.status) {
                    setFiles([...response.data, ...files]);
                }
                else {
                    setError(response.message || "Something went wrong!");
                }
            }
            setTimeout(() => {
                setError(null);
            }, 5000)
        }
    }
    const downloadFile = async (name: string) => {
        const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if(perm.status === 'granted') {
            await homeDriveFileDownload(name, username);
        }
    }
    const removeFile = async (name: string) => {
        const response = await homeDriveFileRemove(name, username);
        if (response === "OK") {
            setFiles(files.filter((item) => item.name !== name));
        }
    }

    useEffect(() => {
        getFileList();
    }, [])

    return (
        <MainView>
            <ButtonsView>
                <StyledButton onPress={addNewFile}>
                    <StyledImage source={require('../assets/add.png')}/>
                    <ButtonText>Add new file</ButtonText> 
                </StyledButton>
                <RefreshButton onPress={getFileList}>
                    <RefreshImage source={require('../assets/refresh.png')}/>
                </RefreshButton>
            </ButtonsView>
            {error && <Error>{error}</Error>}
            <Files contentContainerStyle={{paddingBottom: 50}}>
            {files.map(({name, size }, index) => {
                return (
                    <FileContainer key={index}>
                        <View style={{flex:1}}>
                            <FileName>{name}</FileName>
                            <FileSize>{formatFileSize(size)}</FileSize>
                            <TouchableOpacity onPress={() => removeFile(name)}>
                                <RemoveFileText>Remove file</RemoveFileText>
                            </TouchableOpacity>
                        </View>
                        <DownloadButton onPress={() => downloadFile(name)}>
                            <DownloadImage source={require('../assets/download.png')} />
                        </DownloadButton>
                    </FileContainer>
                )
            })}
            </Files>
        </MainView>
    )
}