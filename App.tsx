import { DarkTheme,  NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import LoginForm from './components/LoginForm';
import LogOutButton from './components/LogOutButton';
import QRScanner from './components/QRScanner';
import 'react-native-gesture-handler';
import Chat from './components/Chat';
import Drive from './components/Drive';

const MainView = styled.View`
  background-color: #111111;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const customFonts = {
  JetBrains: require('./assets/fonts/JetBrains.ttf')
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoaded] = useFonts(customFonts);
  const [userToken, setUserToken] = useState<null | string>(null);

  const handleLogIn = () => {
    setUserToken("dkalkoldka");
  }

  const handleLogOut = () => {
    setUserToken(null);
  }
  if(!isLoaded) return null;

  return (
    <NavigationContainer theme={DarkTheme}>
        {userToken ? 
            <Drawer.Navigator 
              initialRouteName="QR"
              screenOptions={{
                headerTintColor: "white",
                headerRight: () => <LogOutButton logOut={handleLogOut}/>
              }}
            >
              <Drawer.Screen name="QR" component={QRScanner} options={{title: 'Log in with QR code'}}/>
              <Drawer.Screen name="Chat" component={Chat}/>
              <Drawer.Screen name="Drive" component={Drive}/>
            </Drawer.Navigator>
          :
          <MainView>
            <LoginForm logIn={handleLogIn}/>
          </MainView>
        }
    </NavigationContainer>
  );
}