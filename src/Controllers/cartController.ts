import { Request, Response } from "express";
import { CartItemProps, CartItemModel } from "../Models/cartModel";
import HttpStatusCode from "../Logics/httpStatusCode";

class CartController{
    public async addProductToCart(req:Request, res:Response):Promise<void>{
        if(!req.session.user_id){
            res.status(HttpStatusCode.Unauthorized).json({message: "Unauthorized"});
            return;
        }

        const cartItemData : CartItemProps = {
            id:Math.round(Math.random() * 1E6),
            cart_id: <number>req.session.cart_id,
            product_id: Number(req.body.product_id),
            quantity: Number(req.body.quantity)
        }
        try {
            const cartItemModel = new CartItemModel(cartItemData);
            const insertProductSuccess : boolean = await cartItemModel.addCartItem();
            if (!insertProductSuccess) {
                console.error(`Error adding product to cart, cart item with product id ${cartItemData.product_id} has already exist`);
                res.status(HttpStatusCode.NotModified).json({message:"not modified"});
                return;
            }
            res.status(HttpStatusCode.OK).json({message:"ok"});
        } catch (error) {
            console.error("Error adding product to cart \n", error);
        }
    }

    public async deleteItemFromCart(req: Request, res:Response):Promise<void>{
        if(!req.session.user_id){
            res.status(HttpStatusCode.Unauthorized).json({message: "Unauthorized"});
            return;
        }
        const deletedCartItemId : number = Number(req.body.cart_item_id);
        try {
            const cartItemModel = new CartItemModel(deletedCartItemId);
            const deleteCartItemSuccess : boolean = await cartItemModel.deleteCartItem();
            if(!deleteCartItemSuccess){
                console.error(`Error deleting cart item with id ${deletedCartItemId}, from CartController.deleteItemFromCart`);
                res.status(HttpStatusCode.NotModified).json({message:"not modified"});
                return;
            }
            res.status(HttpStatusCode.OK).json({message:"ok"});
        } catch (error) {
            console.error(`Error deleting cart item from cart \n`, error);
        }
    }

    public async showCart(req: Request, res: Response):Promise<void>{
        if(!req.session.user_id){
            res.status(HttpStatusCode.Unauthorized).send("<h3>You're not authorized to see this page</h3>");
            return;
        }
        const cartId : number = <number>req.session.cart_id;
        const userName : string = <string>req.session.username;
        const avatar = req.session.avatar;
        const userData = {
            name: req.session.name,
            email: req.session.email,
            address: req.session.address,
            phone_number : req.session.phone_number
        }
        try {
            const cartItemModel = new CartItemModel(cartId);
            const cartItemData = await cartItemModel.getCartItem();
            if (cartItemData == null) {
                res.render('user/keranjang.pug',{name:userName, avatar:avatar, cartItems: null});
                return;
            }
            //console.log(cartItemData);
            res.render('user/keranjang.pug', {
                name:userName, 
                avatar:avatar, 
                cartItems: cartItemData.productData, 
                cartTotal: cartItemData.cartTotal,
                user: userData
            });
        } catch (error) {
            throw new Error(`Error showing product cart, from CartController.showCart\n ${error}`);
        }
    }
}

export default CartController;