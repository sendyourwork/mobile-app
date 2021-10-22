import React, { useContext } from "react";
import { Camera } from "expo-camera"
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import styled from "styled-components/native";
import { useIsFocused } from "@react-navigation/core";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../config";
import { UserContext } from "../App";
import * as SecureStore from 'expo-secure-store';

interface sizeProps {
    size: number
}

const StyledText = styled.Text`
    color: white;
    font-size: 16px;
    font-family: 'JetBrains';
`
const Header = styled(StyledText)`
    font-size: 22px;
    margin-top: 30px;
    text-align:center;
`
const StyledCamera = styled(Camera)`
    margin:0 auto;
    margin-top: 25px;
    width: ${(props: sizeProps) => props.size}px;
    height: ${(props: sizeProps) => props.size}px;
`

const StyledView = styled.View`
`

interface QRScannerProps {
    logOut: () => void
}

export default function QRScanner({ logOut }: QRScannerProps) {
    const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const isFocused = useIsFocused();
    const user = useContext(UserContext);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    },[])

    const handleScanned = async ({data}: {data: string}) => {
        setScanned(true);
        const accessToken = await SecureStore.getItemAsync('token');
        const socket = io(BACKEND_URL + "/qr", {
            extraHeaders: {
                Authorization: "Bearer " + accessToken
            }
        });
        socket.emit('qr-scanned', { accessToken, id: data});
        alert("Login request successfully sent!")

        setTimeout(() => {
            setScanned(false);
            socket.disconnect();
        }, 5000);
    }

    if(hasPermission === null) return <StyledText>Requesting for camera permission</StyledText>

    if(hasPermission === false) return <StyledText>No access to camera</StyledText>

    return (
        <>
            <StyledView>
                <Header>Scan QR code to log in</Header>
                {isFocused && <StyledCamera
                    onBarCodeScanned = {scanned ? undefined : handleScanned}
                    barCodeScannerSettings = {{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                    }}
                    size = {width * 0.8}
                />
                }
            </StyledView>
        </>
    )
}