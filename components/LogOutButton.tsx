import React from "react"
import styled from "styled-components/native"

const StyledButton = styled.TouchableOpacity`
    margin-right: 10px;
`
const StyledImage = styled.Image`
    height: 30px;
    width: 30px;
`

export default function LogOutButton({logOut}: {logOut: () => void}) {
    return (
        <StyledButton onPress={logOut}>
            <StyledImage source={require('../assets/logout.png')}/>
        </StyledButton>
    )
}