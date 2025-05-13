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
                res.send("<h1> tidak terdaftar didatabase</h1>") 
            }else{
                console.log(userData);
                res.cookie("user_id", userData.id);
                req.session.user_id = userData.id;
                req.session.name = userData.name;
                req.session.email = userData.email;
                req.session.role = userData.role;
                req.session.avatar = userData.avatar;
                req.session.address = userData.address;
                req.session.phone_number = userData.phone_number;
                res.send("<h1>user terdaftar didatabase</h1>")  
            }
        } catch (error) {
            res.send("<h1>error woy</h1>")
            //res.status(500).json({ error: 'Internal server error' });
            throw new Error(`Error in AuthController.loginAttempt\n ${error}`);
        }
        
    }  
}

export default AuthController;