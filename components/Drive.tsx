import React, { useState } from "react"
import styled from "styled-components/native"
import * as DocumentPicker from 'expo-document-picker';
import { View, Button, Text, TouchableOpacity } from "react-native";

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
const Messages = styled.ScrollView`

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

export default function Drive() {
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState([
        {
            id: "amfmfakm",
            name: "fmaklmfakmlaf",
            size: "7 MB"
        },
        {
            id: "amfm",
            name: "fmaklmfakmlaf",
            size: "7 MB"
        }
    ])

    interface FileFromDocumentPicker {
        type: "cancel" | "success" | "error",
        name: string,
        size: number,
        uri: string
    }

    const getFileList = () => {
        //get files from backend
    }

    const addNewFile = async () => {
        const file = await DocumentPicker.getDocumentAsync();
        console.log(file);
        const MAX_SIZE = 1024 * 1024 * 10;
        if((file as FileFromDocumentPicker).size > MAX_SIZE) {
            setError("Your file weights more than 10 MB");
            setTimeout(() => {
                setError(null);
            }, 5000)
        }
        //FIles to FormData and backend connect 
    }
    const downloadFile = (id: string) => {
        //Logic for downloading file from server
    }
    const removeFile = (id: string) => {
        //Logic for removing file from server
    }
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
            <Messages>
            {files.map(({name, size, id}) => {
                return (
                    <FileContainer key={id}>
                        <View style={{flex:1}}>
                            <FileName>{name}</FileName>
                            <FileSize>{size}</FileSize>
                            <TouchableOpacity onPress={() => removeFile(id)}>
                                <RemoveFileText>Remove file</RemoveFileText>
                            </TouchableOpacity>
                        </View>
                        <DownloadButton onPress={() => downloadFile(id)}>
                            <DownloadImage source={require('../assets/download.png')} />
                        </DownloadButton>
                    </FileContainer>
                )
            })}
            </Messages>
        </MainView>
    )
}