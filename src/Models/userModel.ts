import fs from 'fs';
import path from 'path';
import { UserService } from '../Config/db';

export interface UserProps{
    id: number;
    name: string;
    email: string;
    role : string;
    avatar: string;
    password: string;
    address: string;
    phone_number: string;
}

export interface UserUpdateProps{
    avatar : string | null;
    name: string | null;
    address: string | null;
    phone_number: string | null;
}

export class UserModel{
    private userService : UserService;

    constructor(){
        this.userService = new UserService();
    }

    public async updateProfile(updatedData : UserUpdateProps, id : number, oldAvatar?:string|null):Promise<boolean>{
        //delete the old profile foto
        if(updatedData.avatar && oldAvatar){
            const oldAvatarPath = path.join(__dirname, '..', 'Public', 'user_avatar', oldAvatar);
            try {
                if (fs.existsSync(oldAvatarPath)) {
                    await fs.promises.unlink(oldAvatarPath);
                    console.log(`Successfully deleted old avatar: ${oldAvatarPath}`);
                } else {
                    console.log(`Old avatar not found, no deletion needed: ${oldAvatarPath}`);
                }
            } catch (error) {
                console.error(`Error deleting old avatar ${oldAvatarPath}:`, error);
            }
        }

        // update the user data in the database
        try {
            const updateResult = await this.userService.updateUserTable(updatedData, id);
            if(!updateResult){
                return false;
            }
        } catch (error) {
            console.error("Error updating user data in UserModel.updateProfile");
            return false;
        }
        return true;
    }
}