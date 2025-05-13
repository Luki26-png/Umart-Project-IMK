import { Request, Response } from "express";
import Product, {ProductProps} from "../Models/productModel";

class ProductController{
    public async addNewProduct(req: Request, res: Response): Promise<void>{
        const productData : ProductProps = {
            id:Math.round(Math.random() * 1E6),
            name:req.body.nama_produk,
            description: req.body.deskripsi_produk,
            price: req.body.harga_produk,
            summary: req.body.deskripsi_produk.substring(0, 20),
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
}

export default ProductController;