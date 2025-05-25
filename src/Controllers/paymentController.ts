import { Request, Response } from "express";
import path from "path";
import { PaymentDetailModel} from "../Models/orderModel";
const page401 = path.join(__dirname,"..", "Public", "static_html", "401.html");

class PaymentController{
    public async showPaymentList(req:Request, res:Response):Promise<void>{
        if (!req.session.user_id) {
            res.status(401).sendFile(page401);
            return;
        }

        try {
            const userId = req.session.user_id;
            const userName = req.session.username;
            const avatar = req.session.avatar;
            const paymentDetailModel = new PaymentDetailModel(null);
            const paymentList = await paymentDetailModel.getPaymentDetailsByUserId(userId);
            //console.log(paymentList);
            if (paymentList == null) {
                res.render('user/paymentlist.pug', {name:userName, avatar:avatar, paymentList:null})
                return;
            }
            res.render('user/paymentlist.pug', {name:userName, avatar:avatar, paymentList:paymentList});
        }catch(error){
            throw new Error("Error showing payment list from PaymentController.showPaymentList");
        }
    }

    public async showPaymentPage(req:Request, res:Response):Promise<void>{
        if (!req.session.user_id) {
            res.status(401).sendFile(page401);
            return;
        }
        if (!req.query.orderId || !req.query.amount || !req.query.second_passed) {
            res.send("<h1>Lack of Information</h1>");
            return;
        }
        const orderId = req.query.orderId;
        const second_passed = req.query.second_passed;
        let amount = <string>req.query.amount;
        if(amount){
            amount = amount.replace(/\D/g, '');
        }

        res.render('user/payment.pug', 
            {link:`https://umart-910a5.web.app?id=${orderId}&nominal=${amount}`, 
            total: req.query.amount,
            orderId: orderId,
            second_passed: second_passed}
        );
    }
}
export default PaymentController;