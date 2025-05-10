import express from 'express';

const authentication = express.Router();

authentication.get('/login', (_req, res)=>{
    res.send("<h1>this is login route</h1>");
});

authentication.get('/register', (_req, res)=>{
    res.send("<h1>this is register route</h1>");
});

export default authentication;