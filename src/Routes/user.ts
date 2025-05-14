import express from 'express';
import ProductController from '../Controllers/productController';

const user = express.Router();
user.use('/public',express.static(__dirname + '/../Public'));
const productController = new ProductController();

user.get('/', (req, res)=>{
    res.send("<h1>this is user route</h1>")
});

user.get('/product-detail', productController.showProductDetail);

user.get('/product-list',productController.showProductCardList);

export default user;