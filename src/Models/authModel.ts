import { AuthService } from "../Config/db";
import { RowDataPacket } from "mysql2";

export interface AuthData{
    email: string;
    password: string;
}

export interface RegisterData{
    id : number;
    name: string;
    email: string;
    password: string;
}

export class AuthModel{
    private authData : AuthData|RegisterData;
    private authService : AuthService;

    public constructor(authData: AuthData|RegisterData){
        this.authData = authData;
        this.authService = new AuthService();
    }

    public async login(): Promise<RowDataPacket|null>{
        if (!this.isAuthData(this.authData)) {
            throw new Error("Invalid auth data type for login in AuthModel.login");
        }
        try {
           const loginResult : RowDataPacket[] = await this.authService.findUser(this.authData);
           if (loginResult.length == 0){
                return null;
           }
           return loginResult[0];
        } catch (error) {
            console.error("Login error:", error);
            return null;
        }
    }

    public async register():Promise<boolean>{
        if (!this.isRegisterData(this.authData)) {
            throw new Error("invalid auth data type for register in AuthModel.register");
        }
        try {
            const registerSuccess = await this.authService.registerNewUser(this.authData);
            if(registerSuccess){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.error("register new user fail\n", error);
            return false;
        }
    }

    //Creating type guards
    private isAuthData(data:any): data is AuthData{
        return typeof data.email === "string" && typeof data.password === "string" && !("name" in data);
    }

    private isRegisterData(data:any):data is RegisterData{
        return(
            typeof data.id === "number" &&
            typeof data.name === "string" &&
            typeof data.email === "string" &&
            typeof data.password === "string"
        );
    }
}