import express from 'express';
import PaymentController from '../Controllers/paymentController';

const payment = express.Router()
const paymentController = new PaymentController();

payment.post('/payment', paymentController.checkPaymentCompletion);

payment.get('/payment-success', (req, res)=>{
    const orderId = req.query.orderId;
    res.render('user/paymentsuccess.pug', {orderId:orderId});
});

export default payment;