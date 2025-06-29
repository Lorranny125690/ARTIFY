import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react';
import Axios from '../../scripts/axios';

//Refazendo do jeito certo ?? https://youtu.be/9vydY9SDtAo?si=iagd3PB4HwvdFfq5

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null}
    onRegister?: (Email: string, Password: string, userName: string) => Promise<any>;
    onLogin?: (Email: string, Password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

export const API_URL = 'https://image-smith.onrender.com' 
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync("my-jwt")
            console.log("file: AuthContext.tsx:32 ~loadToken ~token:", token);
            
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token,
                    authenticated: true
                })
            }
        }
        loadToken();
    }, [])

    const register = async (Email: string, Password: string, userName: string) => {
        try {
          const result = await Axios.post(`/user`, { Email, Password, userName });
      
          const token = result.data.token;
          const username = result.data.User;
          const status = result.data.statusCode;
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await SecureStore.setItemAsync("my-jwt", token);
            await SecureStore.setItemAsync('userName', username);
            console.log("Token:" + token)
            console.log("username:" + username)
            setAuthState({ token, authenticated: true });
          }
      
          return result;
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.msg || "Erro ao registrar", status: (e as any).response?.status };
        }
    }

    const login = async (Email: string, Password: string) => {
        try {
            const result = await Axios.post(`/user/login`, { Email, Password });
            const {userId} = result.data
        
            console.log("Login result:", userId);

            setAuthState({
                token: userId,
                authenticated: true,
            });
      
            console.warn("pre warning")
            await SecureStore.setItemAsync("my-jwt", userId);
            console.log("Stored info to SecureStorage" + userId)
            return result;
        } catch (e) {
          return { error: true, msg: (e as any).response?.data?.msg || "Erro ao fazer login" };
        }
    };      

    const logout = async () => {
        await SecureStore.deleteItemAsync("my-jwt");

        axios.defaults.headers.common['Authorization'] = ``;
        
        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}