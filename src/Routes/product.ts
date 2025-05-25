import express from 'express';
import multer from 'multer';
//controllers
import ProductController from '../Controllers/productController';


const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, __dirname + "/../Public/product_img/");
    },
    filename(_req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${file.originalname}-${uniqueSuffix}.jpeg`);
    },
});

const upload = multer({storage:storage});
const product = express.Router();

const productController = new ProductController();

product.post('/product', upload.single('img-file'), productController.addNewProduct);
product.get('/find-product', productController.findProductName);

export default product;