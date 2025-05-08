// src/services/loginService.ts
import axios from "axios";
import { API_URL } from "../../scripts/AuthContext/authenticatedUser";

export const loginService = async () => {
  try {
    const result = await axios.post(`${API_URL}/user/login`);
    console.log("File: loginService.ts ~ testLoginConnection ~ result: ", result);
  } catch (error) {
    console.error("Erro na conexão com o login:", error);
  }
};
