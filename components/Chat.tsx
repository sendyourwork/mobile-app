import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { Message as MessageI} from "../interfaces/message"

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
const AvatarPlaceholder = styled.View`
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: white;
    margin-right: 5px;
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

export default function Chat(): JSX.Element {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<MessageI[]>(
        [
            {
                messageId: "adadaaddad",
                senderId: "abcd123",
                senderIcon: "dakdaj",
                message: "Wilczur OP"
            },
            {
                messageId: "daoadjdajoda",
                senderId: "Artiu",
                senderIcon: "adadad",
                message: "Wilczur Giga OP"
            }
        ]);
    const chatRef = useRef<ScrollView>(null);
    const clientId = "Artiu";

    const handleSubmit = () => {
        if (inputValue) {
            setMessages([...messages, { messageId: String(messages.length), senderId: clientId, message: inputValue, senderIcon: "ojaofa" }]);
            setInputValue('');
        }
    }

    useEffect(() => {
        if (messages.length > 200) {
            setMessages(messages.slice(1));
        }
        chatRef.current?.scrollToEnd();
    }, [messages])

    return (
        <MainView>
            <MessagesView ref={chatRef} contentContainerStyle={{paddingBottom: 15}}>
                {messages.map(({ messageId, senderId, senderIcon, message }: MessageI) => {
                    if (clientId === senderId) {
                        return (
                            <View key={messageId} style={{ alignItems: 'baseline' }}>
                                <MyMessage>
                                    <Text>{message}</Text>
                                </MyMessage>
                            </View>
                        )
                    }
                    return (
                        <MessageContainer key={messageId}>
                            <AvatarPlaceholder></AvatarPlaceholder>
                            <View style={{ alignItems: 'baseline' }}>
                                <SomeoneMessage>
                                    <Text>{message}</Text>
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