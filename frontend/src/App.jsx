
import './App.css'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import {Route, Routes} from "react-router";
import AuthPage from './pages/AuthPage';

//by default its redirect
function App() {
  return (
    <>
      <ThemeProvider>
        <WallpaperProvider>
          <Routes>
            <Route path = "/" element = {<ChatPage />} />
            <Route path = "/auth" element = {<AuthPage />} />
          </Routes>
        </WallpaperProvider>
      </ThemeProvider>
    </>
  )
}

export default App
