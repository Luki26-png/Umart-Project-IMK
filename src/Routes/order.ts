import express from 'express';
import OrderController from '../Controllers/orderController';

const order = express.Router()
const orderController = new OrderController();
order.post('/order',orderController.createOrder);

export default order;