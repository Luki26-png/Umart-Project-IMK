import { Request, Response } from "express";
import { AuthModel, AuthData, RegisterData } from "../Models/authModel";
import { CartModel, CartProps } from "../Models/cartModel";
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
                res.status(403).json({message:"login failed"})
            }else{
                //console.log(userData);
                res.cookie("user_id", userData.id);
                req.session.user_id = userData.id;
                req.session.name = userData.name;
                req.session.username = getFirstWord(userData.name);
                req.session.email = userData.email;
                req.session.role = userData.role;
                req.session.avatar = userData.avatar;
                req.session.address = userData.address;
                req.session.phone_number = userData.phone_number;
                req.session.cart_id = userData.cart_id;
                res.status(200).json({message:"login success"});
            }
        } catch (error) {
            res.status(500).json({message:"server error"})
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
        };

        //cart for the new user
        const newUserCart : CartProps={
            id: Math.round(Math.random() * 1E6),
            user_id: registerData.id,
            total: 0
        };

        try {
            //initialize models
            const authModel : AuthModel = new AuthModel(registerData);
            const cartModel : CartModel = new CartModel(newUserCart);

            //register new user
            const registerSuccess : boolean = await authModel.register();
            //initialize new cart for new user
            const initializeCartSuccess : boolean = await cartModel.initializeCart();

            if(registerSuccess && initializeCartSuccess){
                req.session.user_id = registerData.id;
                req.session.name = registerData.name;
                req.session.username = getFirstWord(registerData.name);
                req.session.email = registerData.email;
                req.session.role = registerData.role;
                req.session.avatar = null;
                req.session.address = null;
                req.session.phone_number = null;
                req.session.cart_id = newUserCart.id;
                //console.log(registerData);
                res.status(200).json({message:"registration success"})
            }else{
                res.status(403).json({message:"registration failed"})
            }
        } catch (error) {
            res.status(500).json({message:"server error"})
            throw new Error(`Error in AuthController.registerAttempt\n ${error}`)
        }
    }
}

export default AuthController;