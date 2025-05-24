import { CartService, CartItemService } from "../Config/db";
import { RowDataPacket } from "mysql2";
import formatNumberString from "../Logics/numberFormatter";

export interface CartProps{
    id: number;
    user_id: number;//the owner of the card
    total: number;
}

export interface CartItemProps{
    id: number;
    cart_id: number; // which cart this item belongs to
    product_id: number;//the product of this cart item
    quantity: number;
}

type CartItemId = number;
type CartId = number;

export class CartModel{
    private props: CartProps;
    private cartService : CartService;
    
    public constructor(props: CartProps){
        this.validate(props);
        this.props = props;
        this.cartService = new CartService();
    }

    private validate(props: CartProps){
        if (!props.id || !props.user_id) {
            throw new Error("id and user_id are required");
        }
    }

    public async initializeCart():Promise<boolean>{
        try {
          const initializeResultOk: boolean = await this.cartService.insertToCartTable(this.props);
          if(!initializeResultOk){
            throw new Error("Error initializing new cart, from CartModel.initializeCart");
          }
          return true;  
        } catch (error) {
            throw new Error("Error initializing new cart, from CartModel.initializeCart");
        }
    }

};

export class CartItemModel{
    private props: CartItemProps|CartItemId|CartId;
    private cartItemService: CartItemService;

    public constructor(props: CartItemProps|CartItemId|CartId){
        this.props = props;
        this.cartItemService = new CartItemService();
    }

    public async addCartItem():Promise<boolean>{
        if (!this.isCartItemProps(this.props)) {
            throw new Error("the data type must be CartItemProps, from CartItemModel.addCartItem");
        }
        try {
            const alreadyInCart : boolean = await this.cartItemService.isItemInCart(this.props.cart_id, this.props.product_id);
            if(alreadyInCart){
                console.log(`Item with product id ${this.props.product_id} already in cart, From CartItemModel.addCartItem`);
                return false;
            }

            const addingResultOk : boolean = await this.cartItemService.insertToCartItemTable(this.props);
            if(!addingResultOk){
                console.error("Error adding product to cart, from CartItemModel.addCartItem");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error adding product to cart, from CartItemModel.addCartItem\n", error);
            return false;
        }
    }

    public async deleteCartItem():Promise<boolean>{
        if (!this.isNumber(this.props)) {
            throw new Error("The data type must be number to delete product, from CartItemModel.deleteCartItem");
        }
        try {
            const deleteResultOk : boolean = await this.cartItemService.deleteFromCartItemTable(this.props);
            if(!deleteResultOk){
              return false;  
            }
            return true;
        } catch (error) {
            console.error(`Error deleting cart Item, from CartItemModel.deleteCartItem\n`, error);
            return false;
        }
    }

    public async deleteCartItemAfterMakeOrder(productId : number):Promise<boolean>{
        if(!this.isNumber(this.props)){
            throw new Error("The data type must be number to delete product, from CartItemModel.deleteCartItemAfterMakeOrder");
        }
        try {
            const deleteResultOk : boolean = await this.cartItemService.deleteCartItemWithCartAndProductId(this.props, productId);
            if(!deleteResultOk){
              return false;  
            }
            return true;
        } catch (error) {
            console.error(`Error deleting cart Item, from CartItemModel.deleteCartItemAfterMakeOrder\n`, error);
            return false;
        }
    }

    public async getCartItem(): Promise< {productData:RowDataPacket[], cartTotal:string} | null> {
        if (!this.isNumber(this.props)) {
            throw new Error("The data type must be number | cart_id to delete product, from CartItemModel.deleteCartItem");
        }
        try {
            const cartItemData = await this.cartItemService.retrieveCartItemTable(this.props);
            if(cartItemData.length == 0){
                console.log(`Fail to retrieve cart items, cart with id = ${this.props} is empty, from CartItemModel.getCartItem`);
                return null;
            }
            //get the total price of the cart
            let cartTotalPrice : number = 0;
            cartItemData.forEach((item)=>{
                cartTotalPrice += parseInt(item.price, 10) * item.quantity;
            });
            let formattedCartTotalPrice : string = formatNumberString(cartTotalPrice.toString());
            //format the price of each cart item to have thousand separator
            cartItemData.forEach((item)=>{
                item.price = formatNumberString(item.price);
            });
            return {productData : cartItemData, cartTotal: formattedCartTotalPrice};
        } catch (error) {
            console.error(`Error retrieveing cart items data,  from CartItemModel.getCartItem\n`, error);
            return null;
        }
    }

    //create type guard
    private isNumber(data:any):data is number{
        return typeof data === "number";
    }

    private isCartItemProps(data:any):data is CartItemProps{
        return(
            typeof data.id === "number" &&
            typeof data.cart_id === "number" &&
            typeof data.product_id === "number" &&
            typeof data.quantity === "number"
        );
    }
}