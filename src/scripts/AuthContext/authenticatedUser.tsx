import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import Axios from '../axios';

// Interface para as props do AuthContext
interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (Email: string, Password: string, userName: string) => Promise<any>;
  onLogin?: (Email: string, Password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = 'https://image-smith.onrender.com';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("file: AuthContext.tsx:32 ~loadToken ~token:", token);
      if (token) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (Email: string, Password: string, userName: string) => {
    try {
      const result = await Axios.post(`/user`, { Email, Password, userName });
      const token = result.data.token;
      const username = result.data.User;
      alert(username);

      if (token) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync('userName', username);
        console.log("Token:" + token);
        console.log("username:" + username);
        setAuthState({ token, authenticated: true });
      }

      return result;
    } catch (e) {
      console.error("Erro ao registrar:", e);
      return { error: true, msg: (e as any).response?.data?.msg || "Erro ao registrar" };
    }
  };

  const login = async (Email: string, Password: string) => {
    try {
      const result = await Axios.post(`/user/login`, { Email, Password });
      console.log("Login result:", result.data);

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      Axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

      return result;
    } catch (e) {
      console.error("Erro ao fazer login:", e);
      return { error: true, msg: (e as any).response?.data?.msg || "Erro ao fazer login" };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    Axios.defaults.headers.common['Authorization'] = ``;

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const UserName = async () => {
    try {
      const uuser = await Axios.get(`/user`);
      const nameUser = uuser.data.User;
      return nameUser;
    } catch (e) {
      console.error("Erro ao buscar nome do usuário:", e);
      return null;
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
