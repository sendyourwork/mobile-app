import { useFonts } from 'expo-font';
import React from 'react';
import styled from 'styled-components/native';
import LoginForm from './components/LoginForm';

const StyledView = styled.View`
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

  return (
    <>
      {isLoaded &&
      <StyledView>
        <LoginForm />
      </StyledView>
      }
    </>
  );
}