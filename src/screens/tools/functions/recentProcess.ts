import { AuthUser } from "../../../scripts/AuthContext/authenticatedUser";
import { Axios } from "../../../scripts/axios";
import { Images } from "../../../types/entitys/images";


export async function RecentProcessedImages():Promise<Images[]> {
    const autenticationController = new AuthUser()
    const IsTokenStored = await autenticationController.GetUserToken();
    if(IsTokenStored){
        await Axios.get("/image",{
            headers:{'Authorization': `Bearer ${IsTokenStored.id}`}
        })
        .then(res=>{
            if(res.status==200){
                return res.data.images 
            }else{
                throw new Error("Usuário não encontrado; o Token fornecido está errado")
            }
        })
        .catch(err=>{
            console.error(err)
            throw new Error("Erro desconhecido")
        })
    }else{
        alert("Por favor faça login primeiro")
        throw new Error("O token nao foi fornecido")
    }

    return []
}