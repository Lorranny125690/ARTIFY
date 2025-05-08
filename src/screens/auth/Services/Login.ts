// Login.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL, useAuth } from '../../../contexts/AuthContext/authenticatedUser';

const Login = async () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { onLogin, onRegister } = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.post(`${API_URL}/user/login`);
      console.log("File: Login text:16 ~ testCall ~ result: ", result);
    };

    testCall();
  }, []);

  //git
};

export default Login;
