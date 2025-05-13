import express from 'express';
import AuthController from '../Controllers/authController';

const authentication = express.Router();
const authController = new AuthController();

authentication.post('/login',authController.loginAttempt);

authentication.post('/register', (_req, res)=>{
    res.send("<h1>this is register route</h1>");
});

export default authentication;