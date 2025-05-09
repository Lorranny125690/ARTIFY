// Login.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../contexts/AuthContext/authenticatedUser';

const Login = async () => {

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.post(`${API_URL}/user/login`)
      console.log("File: Login text:16 ~testcall ~result: ", result)
    }
  
    testCall();
  }, [])
};

export default Login;
