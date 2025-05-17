import express from 'express';
import CartController from '../Controllers/cartController';

const cart = express.Router();
const cartController = new CartController();

cart.post('/cart', cartController.addProductToCart);

export default cart;