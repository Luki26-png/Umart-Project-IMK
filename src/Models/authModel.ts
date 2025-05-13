import { AuthService } from "../Config/db";
import { RowDataPacket } from "mysql2";

export interface AuthData{
    email: string;
    password: string;
}

export class AuthModel{
    private authData : AuthData;
    private authService : AuthService;

    public constructor(authData: AuthData){
        this.authData = authData;
        this.authService = new AuthService();
    }

    public async login(): Promise<RowDataPacket|null>{
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

}