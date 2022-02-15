import React, { SetStateAction, useState } from "react"
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import loginWithNameAndPassword from "../utils/loginWithUsernameAndPassword";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../interfaces/user";

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
const Error = styled.Text`
    color: red;
    text-align: center;
`

interface LoginFormProps {
    setUserData: any
}

export default function LoginForm({setUserData}: LoginFormProps) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePress = async () => {
        if(login && password) {
            setIsLoading(true);
            const res = await loginWithNameAndPassword(login, password);
            
            if(res.accessToken) {
                await AsyncStorage.setItem('token', res.accessToken)
                setUserData(res);
            }
            else {
                setError(res.errors[0].msg);
                setIsLoading(false);
            }
        }
        else {
            setError("Username and password cannot be empty");
        }
    }
    if(isLoading){
        return (
            <ActivityIndicator color="#4158D0" size="large" />
        )
    }

    return (
        <Form>
            <Input defaultValue={login} placeholder="Your name" onChangeText={(text: string) => setLogin(text)}/>
            <Input secureTextEntry={true} defaultValue={password} placeholder="Password" onChangeText={(text: string) => setPassword(text)}/>
            {error && <Error>{error}</Error>}
            <StyledButton onPress={handlePress}>
                <StyledText>
                    Log in 
                </StyledText>
            </StyledButton>
        </Form>
    )
}