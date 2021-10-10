import React from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const StyledText = styled.Text`
    color: white;
    font-size: 16px;
`
const Header = styled(StyledText)`
    font-size: 30px;
    text-align:center;
`
const StyledCamera = styled(BarCodeScanner)`
    width: 268px;
    height: 268px;
    margin:20px auto;
`

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    },[])

    const handleScanned = ({data}: {data: string}) => {
        setScanned(true);
        alert("Scanned data: " + data)
        //On the end for fetch opperation add SetScanned(false)
    }

    if(hasPermission === null) return <StyledText>Requesting for camera permission</StyledText>

    if(hasPermission === false) return <StyledText>No access to camera</StyledText>

    return (
        <View>
            <Header>Scan QR code to log in</Header>
            <StyledCamera onBarCodeScanned = {scanned ? undefined : handleScanned}/>
        </View>
    )
}