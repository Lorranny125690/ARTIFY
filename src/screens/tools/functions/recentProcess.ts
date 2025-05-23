import { useAuth } from "../../../contexts/AuthContext/authenticatedUser";
import Axios from "../../../scripts/axios";
import type { Images } from "../../../types/entitys/images";

export async function RecentProcessedImages(): Promise<Images[]> {
    const { authState } = useAuth();

    const token = authState?.authenticated;
    
    if (!token) {
        alert("Por favor faça login primeiro");
        throw new Error("O token não foi fornecido");
    }

    try {
        const res = await Axios.get("/image/{id}", {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 200) {
            return res.data.images;
        } else {
            throw new Error("Usuário não encontrado; o Token fornecido está errado");
        }
    } catch (err) {
        console.error(err);
        throw new Error("Erro desconhecido");
    }
}