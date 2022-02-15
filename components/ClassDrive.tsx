import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components/native"
import * as DocumentPicker from 'expo-document-picker';
import { View,  TouchableOpacity, ActivityIndicator, Picker } from "react-native";
import classDriveUpload from "../utils/classDriveFileUpload";
import { UserContext } from "../App";
import classDriveGetFiles from "../utils/classDriveGetFiles";
import formatFileSize from "../helpers/formatFileSize";
import classDriveFileRemove from "../utils/classDriveFileRemove";
import classDriveFileDownload from "../utils/classDriveFileDownload";
import * as Permissions from 'expo-permissions';

import { User } from "../interfaces/user";
import getSubjects from "../utils/getSubjects";

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
const StyledPicker = styled.Picker`
    border: green solid 1px;
    background-color: white;
    color: white;
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

export default function ClassDrive() {
    const [error, setError] = useState<string | null>(null);
    const [driveName, setDriveName] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { school_class } = useContext(UserContext) as User;

    const getFileList = async () => {
        if(driveName !== ''){
            setIsLoading(true);
            const data = await classDriveGetFiles(school_class, driveName);
            setFiles(data);
            setIsLoading(false);
        }
    }

    const addNewFile = async () => {
        const file = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false
        });
        const MAX_SIZE = 1024 * 1024 * 10;
        if(file.type === "success") {
            setIsLoading(true);
            if((file as FileFromDocumentPicker).size > MAX_SIZE) {
                setError("Your file weights more than 10 MB");
            }
            else {  
                const response = await classDriveUpload(file, school_class, driveName);

                if (response.status) {
                    setFiles([...response.data, ...files]);
                }
                else {
                    setError(response.message || "Something went wrong!");
                }
            }
            setIsLoading(false);
            setTimeout(() => {
                setError(null);
            }, 5000)
        }
    }
    const downloadFile = async (name: string) => {
        const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if(perm.status === 'granted') {
            setIsLoading(true);
            await classDriveFileDownload(name, school_class, driveName);
            setIsLoading(false);
        }
    }
    const removeFile = async (name: string) => {
        setIsLoading(true);
        const response = await classDriveFileRemove(name, school_class, driveName);
        if (response === "OK") {
            setFiles(files.filter((item) => item.name !== name));
        }
        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            const subjects = await getSubjects(school_class);
            setOptions(subjects.map((item: string) => {return ({
                value: item,
                label: item
            })}));
            setDriveName(subjects[0] || null)
        })()
    }, [])


    useEffect(() => {
        if(driveName) {
            getFileList();
        }
    }, [driveName])


    return (
        <MainView>
            <ButtonsView>
                <StyledButton onPress={addNewFile}>
                    <StyledImage source={require('../assets/add.png')}/>
                    <ButtonText>Add new file</ButtonText> 
                </StyledButton>

                <StyledPicker 
                    selectedValue={driveName}
                    onValueChange={(e) => {
                        setDriveName(e)
                    }} 
                    style={{ height: 50, width: 150 }}>
                    {options.map((el : {value: string, label: string}, i) =>{ return (
                            <StyledPicker.Item key={i} label={el.label} value={el.value} />
                        )})}
                </StyledPicker>

                <RefreshButton onPress={getFileList}>
                    <RefreshImage source={require('../assets/refresh.png')}/>
                </RefreshButton>
            </ButtonsView>
            {error && <Error>{error}</Error>}
            <Files contentContainerStyle={{paddingBottom: 50}}>
            {isLoading ?
                <View style={{paddingTop: 50, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#4158D0"/>
                </View>
                    :
                files.map(({name, size }, index) => {
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
                })   
            }
            </Files>
        </MainView>
    )
}