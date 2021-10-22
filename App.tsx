import { DarkTheme,  NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import LoginForm from './components/LoginForm';
import LogOutButton from './components/LogOutButton';
import QRScanner from './components/QRScanner';
import 'react-native-gesture-handler';
import Chat from './components/Chat';
import Drive from './components/Drive';
import { User } from './interfaces/user';
import * as SecureStore from 'expo-secure-store';
import getUserData from './utils/getUserData';
import { ActivityIndicator } from 'react-native';

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

export const UserContext = createContext<undefined | User>(undefined);

export default function App() {
  const [isLoaded] = useFonts(customFonts);
  const [userData, setUserData] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogOut = async () => {
    await SecureStore.deleteItemAsync('token');
    setUserData(null);
  }

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      if(token) {
        const res = await getUserData(token);
        if(res.user) {
          setUserData(res.user);
        }
      }
      setIsLoading(false);
    })()
  }, [])
  if(!isLoaded) return null;

  if(isLoading) {
    return (
      <MainView>
        <ActivityIndicator size="large"/>
      </MainView>
    )
  }

  return (
    <NavigationContainer theme={DarkTheme}>
        {userData ? 
          <UserContext.Provider value={userData}>
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
          </UserContext.Provider>
          :
          <MainView>
            <LoginForm setUserData={setUserData}/>
          </MainView>
        }
    </NavigationContainer>
  );
}