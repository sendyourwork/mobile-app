import React, { useState } from "react"
import styled from "styled-components/native";

const Form = styled.View`
    width: 80%;
`
const Input = styled.TextInput`
    font-size: 16px;
    padding: 16px;
    background-color: white;
    margin: 15px 0;
    border-radius: 4px;
    font-family: 'JetBrains';
`
const StyledButton = styled.TouchableOpacity`
    background-color: #4158D0;
    color: white;
    margin-top: 45px;
    padding: 10px 0;
    border-radius: 4px;
`
const StyledText = styled.Text`
    color: white;
    text-align: center;
    font-size: 16px;
    font-family: 'JetBrains';
`

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handlePress = () => {
    }

    return (
        <Form>
            <Input defaultValue={login} placeholder="Your name" onChangeText={(text: string) => setLogin(text)}/>
            <Input secureTextEntry={true} defaultValue={password} placeholder="Password" onChangeText={(text: string) => setPassword(text)}/>
            <StyledButton onPress={handlePress}>
                <StyledText>
                    Login 
                </StyledText>
            </StyledButton>
        </Form>
    )
}