import { CartService, CartItemService } from "../Config/db";

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
    private props: CartItemProps;
    private cartItemService: CartItemService;

    public constructor(props: CartItemProps){
        this.validate(props);
        this.props = props;
        this.cartItemService = new CartItemService();
    }

    private validate(props: CartItemProps){
        if (!props.id || !props.cart_id || !props.product_id) {
            throw new Error("id, cart_id, and product_id are required");
        }
    }

    public async addCartItem():Promise<boolean>{
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
}