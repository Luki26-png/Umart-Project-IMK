import express from 'express';
import multer from 'multer';
import ProductController from '../Controllers/productController';
import UserController from '../Controllers/userController';

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

user.get('/', (req, res)=>{
    res.send("<h1>this is user route</h1>")
});

user.get('/add-product',productController.showProductDetailPrice);
user.get('/product-detail', productController.showProductDetail);
user.get('/product-list',productController.showProductCardList);

user.get('/profile', userController.showProfile);
user.put('/profile', upload.single('profile_picture'), userController.updateProfile);

export default user;