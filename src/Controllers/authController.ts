import { Request, Response } from "express";
import { AuthModel, AuthData, RegisterData } from "../Models/authModel";
import { getFirstWord } from "../Logics/stringMod";

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
                req.session.username = getFirstWord(userData.name);
                req.session.email = userData.email;
                req.session.role = userData.role;
                req.session.avatar = userData.avatar;
                req.session.address = userData.address;
                req.session.phone_number = userData.phone_number;
                res.redirect('/');
            }
        } catch (error) {
            res.send("<h1>error woy</h1>")
            //res.status(500).json({ error: 'Internal server error' });
            throw new Error(`Error in AuthController.loginAttempt\n ${error}`);
        }
        
    }
    
    public async registerAttempt(req: Request, res: Response):Promise<void>{
        const registerData : RegisterData = {
            id: Math.round(Math.random() * 1E6),
            name: req.body.name,
            email: req.body.email,
            role: "user",
            password: req.body.password,
        }

        try {
            const authModel : AuthModel = new AuthModel(registerData);
            const registerSuccess : boolean = await authModel.register();
            if(registerSuccess){
                console.log(registerData);
                res.send("<h2>anda berhasil mendaftar</h2>")
            }else{
                res.send("<h2>anda gagal mendaftar</h2>")
            }
        } catch (error) {
            res.send("<h1>Error when trying to Register</h1>")
            throw new Error(`Error in AuthController.registerAttempt\n ${error}`)
        }
    }
}

export default AuthController;