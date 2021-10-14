import React from "react"
import { Image } from "react-native"
import styled from "styled-components/native"

const StyledButton = styled.TouchableOpacity`
    margin-right: 10px;
`

export default function LogOutButton({logOut}: {logOut: () => void}) {
    return (
        <StyledButton onPress={logOut}>
            <Image source={require('../assets/logout.png')} resizeMode="contain"/>
        </StyledButton>
    )
}