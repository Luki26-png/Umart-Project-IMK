import { Request, Response } from "express";
import formatNumberString from "../Logics/numberFormatter";
import ProductCardListModel from "../Models/productCardModel";
import Product, {ProductProps, ProductDetail, ProductSearch} from "../Models/productModel";

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
                let avatar = req.session.avatar;
                res.render('user/daftarproduk.pug', {name:userName, avatar:avatar, cardList:cardList});
            }else{
                res.render('user/daftarproduk.pug', {name:null, avatar:null, cardList:cardList});
            } 
        } catch (error) {
            res.send("<h1>server error</h1>")
            throw new Error("Erorr showing product list, from ProductController.showProductCardList");
        }
        
    }

    public async showProductDetail(req: Request, res: Response){
        let productId: number = Number(req.query.id);
        let productCardListLimit: number = 3;
        try {

            const productDetailModel = new ProductDetail();
            const productCardListModel = new ProductCardListModel(productCardListLimit);

            const productDetailData = await productDetailModel.getOneProduct(productId);
            const cardList = await productCardListModel.retrieveCardListExcludingId(productId);
            if (productDetailData == null) {
                res.render("<h1>server error</h1>")
                throw Error(`Error, product with id ${productId} doesn't exist`);
            }
            //check if user had logged in
            if(req.session.user_id){
                let userName = req.session.username;
                let avatar = req.session.avatar;
                res.render('user/detailproduk.pug', {name:userName, avatar:avatar, cardList:cardList, product:productDetailData});
            }else{
                res.render('user/detailproduk.pug', {name:null, avatar:null, cardList:cardList, product:productDetailData});
            }
            
        } catch (error) {
            res.send("<h1>server error</h1>")
            throw new Error("Error showing product detail, from ProductController.showProductDetail");
        }
    }

    public async showProductDetailPrice(req: Request, res: Response):Promise<void>{
        if(!req.session.user_id){
            res.send("<h3>You have to login first</h3>");
            return;
        }
        let productId: number = Number(req.query.id);
        try {
            const productDetailModel = new ProductDetail();
            const productDetailData = await productDetailModel.getOneProduct(productId);
            if (productDetailData == null) {
                res.render("<h1>server error</h1>")
                throw Error(`Error, product with id ${productId} doesn't exist`);
            }
            //formated the price to have thousand separator
            productDetailData.price = formatNumberString(productDetailData.price)
            let userName = req.session.username;
            let avatar = req.session.avatar;
            res.render('user/tambahproduk.pug', {name:userName, avatar:avatar, product:productDetailData});

        } catch (error) {
            console.error("error showing product detail, from ProductController.showProductDetailPrice");
        }
    }

    public async findProductName(req:Request, res:Response):Promise<void>{
        //get the query
        const productQuery = <string>req.query.q;
        const productSearch = new ProductSearch();
        try {
            const products = await productSearch.searchProduct(productQuery);
            if(products == null){
                res.status(200).json({products:[]});
                return;
            }
            res.status(200).json({products:products});
        } catch (error) {
            console.error("Error searching product, from ProductController.findProductName");
        }
    }
}

export default ProductController;