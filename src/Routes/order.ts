import express from 'express';
import OrderController from '../Controllers/orderController';

const orderController = new OrderController();
const order = express.Router()


order.post('/order',orderController.createOrder);

export default order;