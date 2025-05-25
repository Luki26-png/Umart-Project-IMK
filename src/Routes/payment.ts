import express from 'express';
const payment = express.Router()

payment.use('/public',express.static(__dirname + '/../Public'));

payment.post('/payment',async (req, res)=>{
    console.log("📥 Received /api/payment POST");
  const orderId = req.body.orderId;
  const startWatching = req.app.get("watchPayments");
  startWatching(orderId);
  res.json({ status: "watching" });
});

payment.get('/payment-success', (req, res)=>{
    const orderId = req.query.orderId;
    res.render('user/paymentsuccess.pug', {orderId:orderId});
});

export default payment;