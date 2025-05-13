import express from 'express';
import AuthController from '../Controllers/authController';

const authentication = express.Router();
const authController = new AuthController();

authentication.post('/login',authController.loginAttempt);

authentication.post('/register', authController.registerAttempt);

export default authentication;