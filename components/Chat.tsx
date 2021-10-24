import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { io } from "socket.io-client";
import styled from "styled-components/native";
import { UserContext } from "../App";
import { BACKEND_URL } from "../config";
import { Message as MessageI} from "../interfaces/message"
import * as SecureStore from "expo-secure-store"
import getChatMessages from "../utils/getChatMessages";
import { User } from "../interfaces/user";

const Message = styled.Text`
    font-size: 16px;
    padding: 10px;
    border-radius: 20px;
    margin-top: 5px;
`

const Input = styled.TextInput`
    font-size: 16px;
    padding: 7px 10px;
    background-color: white;
    font-family: 'JetBrains';
    flex: 1;
`
const MainView = styled.View`
    display:flex;
    justify-content: flex-end;
    height: 100%;
`
const MyMessage = styled(Message)`
    background-color: rgb(37, 99, 235);
    color: white;
    align-self: flex-end;
    max-width: 70%;
`

const MessageContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 70%;
`

const SomeoneMessage = styled(Message)`
    background-color: white;
`

const SendContainer = styled.View`
    display:flex;
    flex-direction: row;
`

const SendButton = styled.TouchableOpacity`
    width: 40px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`

const MessagesView = styled.ScrollView`
    padding: 5px;
    flex: 1;
`

const Nick = styled.Text`
    color: grey;
    margin-left: 3px;
`

export default function Chat(): JSX.Element {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<MessageI[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const chatRef = useRef<ScrollView>(null);
    const user = useContext(UserContext);

    const handleSubmit = () => {
        if (inputValue) {
            socket?.emit('chat-msg-client', {
                msg:inputValue,
                username: user?.username
            });
            setInputValue('');
        }
    }

    useEffect(() => {
        if (messages.length > 200) {
            setMessages(messages.slice(1));
        }
        chatRef.current?.scrollToEnd();
    }, [messages])

    useEffect(() => {
        (async() => {
            const res = await getChatMessages((user as User).school_class);
            setMessages(res);
            const token = await SecureStore.getItemAsync('token');
            const newSocket = io(BACKEND_URL, {
                extraHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            newSocket.on('chat-msg-server',(msg: MessageI) => {
                setMessages(prevMessages => [...prevMessages, msg]);
            })
            setSocket(newSocket);
            return () => {
                newSocket.disconnect();
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <MainView>
            <MessagesView ref={chatRef} contentContainerStyle={{paddingBottom: 15}}>
                {messages.map(({ msg, username }: MessageI, index) => {
                    if (username === user?.username) {
                        return (
                            <View key={index} style={{ alignItems: 'baseline' }}>
                                <MyMessage>
                                    <Text>{msg}</Text>
                                </MyMessage>
                            </View>
                        )
                    }
                    return (
                        <MessageContainer key={index}>
                            <View style={{ alignItems: 'baseline' }}>
                                {username !== messages[index - 1]?.username && <Nick>{username}</Nick>}
                                <SomeoneMessage>
                                    <Text>{msg}</Text>
                                </SomeoneMessage>
                            </View>
                        </MessageContainer>
                    )
                })
                }
            </MessagesView>
            <SendContainer>
                <Input
                    placeholder="Type here..."
                    value={inputValue}
                    onChangeText={(text: string) => setInputValue(text)}
                />
                <SendButton onPress={handleSubmit}>
                    <Image source={require("../assets/send.png")} />
                </SendButton>
            </SendContainer>
        </MainView>
    )
}