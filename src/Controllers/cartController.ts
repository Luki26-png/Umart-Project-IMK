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
}

export default CartController;