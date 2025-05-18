import express from 'express';
import CartController from '../Controllers/cartController';

const cart = express.Router();
const cartController = new CartController();

cart.post('/cart', cartController.addProductToCart);
cart.delete('/cart', cartController.deleteItemFromCart);

export default cart;