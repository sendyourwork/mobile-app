import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import LoginForm from './components/LoginForm';
import QRScanner from './components/QRScanner';

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

export default function App() {
  const [isLoaded] = useFonts(customFonts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logIn = () => {
    setIsLoggedIn(true);
  }

  if(!isLoaded) return null;

  return (
    <MainView>
      {isLoggedIn ? 
        <QRScanner />
        :
        <LoginForm logIn={logIn}/>
      }
    </MainView>
  );
}