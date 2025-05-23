import express from 'express';
import multer from 'multer';
import ProductController from '../Controllers/productController';
import UserController from '../Controllers/userController';
import CartController from '../Controllers/cartController';
import OrderController from '../Controllers/orderController';
import PaymentController from '../Controllers/paymentController';

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, __dirname + "/../Public/user_avatar/");
    },
    filename(_req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${file.originalname}-${uniqueSuffix}.jpeg`);
    },
});

const upload = multer({storage:storage});
const user = express.Router();
user.use('/public',express.static(__dirname + '/../Public'));
//initiate controller
const productController = new ProductController();
const userController = new UserController();
const cartController = new CartController();
const orderController = new OrderController();
const paymentController = new PaymentController();

user.get('/', (req, res)=>{
    res.send("<h1>this is user route</h1>")
});

user.get('/pesanan',orderController.showOrder);

user.get('/cart', cartController.showCart);

user.get('/add-product',productController.showProductDetailPrice);
user.get('/product-detail', productController.showProductDetail);
user.get('/product-list',productController.showProductCardList);

user.get('/profile', userController.showProfile);
user.put('/profile', upload.single('profile_picture'), userController.updateProfile);

user.get('/payment', paymentController.showPaymentPage);
user.get('/payment-list',paymentController.showPaymentList);

export default user;