import AsyncStorage from '@react-native-async-storage/async-storage';



//Classe que controla o login de um usuário na ferramenta
// O ideal seria usar context mas preguicinha :)


interface UserInfo{
    id:string | null,
    userName:string | null
}
export class AuthUser {
    protected uid_tokenName = "UserIdToken"
    protected uname_tokenName = "UserNameToken"

    //Use para receber o token
    async GetUserToken():Promise<UserInfo>{
        return {
            id:await AsyncStorage.getItem(this.uid_tokenName),
            userName:await AsyncStorage.getItem(this.uname_tokenName)
        }
    }

    //Use para guardar o token
    async StoreUserToken(token:string){
        await AsyncStorage.setItem(this.uid_tokenName,token)
    }

    //Use for Logout
    async DeleteUserToken(){
        await AsyncStorage.removeItem(this.uid_tokenName)
        await AsyncStorage.removeItem(this.uid_tokenName)
    }

    //Guardar informações extras como por exemplo o nome de um usuário para economizar requisições
    async storeUserInfo(UserName:string){
        return await AsyncStorage.setItem(this.uname_tokenName,UserName)
    }
}