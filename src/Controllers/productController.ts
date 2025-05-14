import { Request, Response } from "express";
import ProductCardListModel from "../Models/productCardModel";
import Product, {ProductProps} from "../Models/productModel";

class ProductController{
    public async addNewProduct(req: Request, res: Response): Promise<void>{
        const productData : ProductProps = {
            id:Math.round(Math.random() * 1E6),
            name:req.body.nama_produk,
            description: req.body.deskripsi_produk,
            price: req.body.harga_produk,
            summary: req.body.deskripsi_produk.substring(0, 120),
            cover: req.file!.filename,
            category: req.body.kategori_produk
        }
        
        try {
            const product = new Product(productData);
            const return_message : any = await product.addNewProduct();
            res.status(200).json({message:return_message});
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            throw new Error(`Error in ProductController addNewProduct ${error}`);
        }
    }

    public async showProductCardList(req: Request, res: Response): Promise<void>{
        let productCardLimit:number = 9;
        try {
            const productCardListModel = new ProductCardListModel(productCardLimit);
            const cardList = await productCardListModel.retrieveCardList();
            if (req.session.user_id) {
                let userName = req.session.username;
                res.render('user/daftarproduk.pug', {name:userName, cardList:cardList});
            }else{
                res.render('user/daftarproduk.pug', {name:null, cardList:cardList});
            } 
        } catch (error) {
            res.send("<h1>server error</h1>")
            throw new Error("Erorr showing product list, from ProductController.showProductCardList");
        }
        
    }
}

export default ProductController;