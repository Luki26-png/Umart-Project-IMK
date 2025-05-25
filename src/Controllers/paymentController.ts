import { Request, Response } from "express";
import { PaymentDetailModel, OrderDetailModel, OrderItemModel, OrderItemStatus} from "../Models/orderModel";

class PaymentController{
    public async showPaymentList(req:Request, res:Response):Promise<void>{
        if (!req.session.user_id) {
            res.send("<h1>Unauthorized</h1>");
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
            res.send("<h1>Unauthorized</h1>");
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

    public async checkPaymentCompletion(req: Request, res: Response): Promise<void> {
        const orderId: number = <number>req.body.orderId;
        const orderDetailModel = new OrderDetailModel(null);

        const paymentComplete = await orderDetailModel.checkOrderPayment(orderId);

        if (!paymentComplete) {
            // Payment not complete yet – delay and respond with "no"
            setTimeout(() => {
                res.status(200).json({ message: "no" });
            }, 3000); // Wait 3s before responding
            return;
        }

        // Payment is complete – update status and respond immediately
        const paymentDetailModel = new PaymentDetailModel(null);
        const orderItemModel = new OrderItemModel();

        await paymentDetailModel.updatePaymentDetailStatusLunas(orderId);
        await orderItemModel.updateOrderItemStatus(orderId, OrderItemStatus.diproses);

        // Respond right away (no setTimeout needed)
        res.status(200).json({ message: "yes" });
    }
}
export default PaymentController;