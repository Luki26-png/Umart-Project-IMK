import { Request, Response } from "express";
import { AuthModel, AuthData } from "../Models/authModel";

class AuthController{
    public async loginAttempt(req :Request, res : Response): Promise<void>{
        const loginData : AuthData = {
            email: req.body.email,
            password: req.body.password
        }
        try {
            const authModel : AuthModel = new AuthModel(loginData);
            const userData =  await authModel.login();
            if (userData == null) {
                res.send("<h1>user tidak terdaftar didatabase</h1>") 
            }
            res.send("<h1>user terdaftar didatabase</h1>")   
        } catch (error) {
            res.send("<h1>error woy</h1>")
            //res.status(500).json({ error: 'Internal server error' });
            throw new Error(`Error in AuthController.loginAttempt\n ${error}`);
        }
        
    }  
}

export default AuthController;