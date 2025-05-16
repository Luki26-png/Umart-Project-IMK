import { Request, Response } from "express";
import HttpStatusCode from "../Logics/httpStatusCode";
import { getFirstWord } from "../Logics/stringMod";
import { UserUpdateProps, UserModel } from "../Models/userModel";

class UserController{
    public async showProfile(req :Request, res : Response):Promise<void>{
        if (!req.session.user_id) {
            res.send("<h3>You're not authorized to see this page</h3>")
            return;
        }
        try {
          let name = req.session.username;
          let fullName = req.session.name;
          let address = req.session.address;
          let phone = req.session.phone_number;
          let avatar = req.session.avatar;  
          res.render('user/profile.pug', {name:name, fullName:fullName, avatar:avatar, address:address, phone:phone});  
        } catch (error) {
            console.error(`Error showing user Profile, from UserController.showProfile\n${error}`);
        }
        
    }

    public async updateProfile(req: Request, res: Response):Promise<void>{
        if(!req.session.user_id){
            res.status(HttpStatusCode.Unauthorized).send("<h3>You have to login first</h3>");
            return;
        }

        const updatedData:UserUpdateProps = {
            name : null,
            avatar: null,
            phone_number: null,
            address: null
        };

        if(req.file){
            updatedData.avatar = req.file.filename;
        }

        if(req.body){
            //loop through req.body and put existing data into updateData object
            for (const [key, value] of Object.entries(req.body)) {
                switch (key) {
                    case "name":
                        updatedData.name = <string>value;
                        break;
                    case "phone_number":
                        updatedData.phone_number = <string>value;
                        break;
                    case "address":
                        updatedData.address = <string>value;
                        break
                    default:
                        break;
                }
            }
        }

        try {
            const userModel = new UserModel();
            if(req.file){
                const updateResult = await userModel.updateProfile(updatedData, req.session.user_id, <string|null>req.session.avatar);
                if(updateResult){
                    const { avatar, address, phone_number, name } = updatedData;
                    req.session.avatar = avatar ?? req.session.avatar;
                    req.session.address = address ?? req.session.address;
                    req.session.phone_number = phone_number ?? req.session.phone_number;
                    req.session.name = name ?? req.session.name;
                    req.session.username = getFirstWord(<string>name ?? req.session.name);
                    res.status(HttpStatusCode.OK).json({message:"ok"});
                    return;
                }
                res.status(HttpStatusCode.NotModified).json({message:"not modified"});
                return;

            }
                
            if(!req.file){
                const updateResult = await userModel.updateProfile(updatedData, req.session.user_id);
                if(updateResult){
                    const { address, phone_number, name } = updatedData;
                    req.session.address = address ?? req.session.address;
                    req.session.phone_number = phone_number ?? req.session.phone_number;
                    req.session.name = name ?? req.session.name;
                    req.session.username = getFirstWord(<string>name ?? req.session.name);
                    res.status(HttpStatusCode.OK).json({message:"ok"});
                    return;
                }
                res.status(HttpStatusCode.NotModified).json({message:"not modified"});
                return;
            }

        }catch (error) {
            console.error(`Error updating user Profile, from UserController.updateProfile\n${error}`);
        }
    }
}

export default UserController;