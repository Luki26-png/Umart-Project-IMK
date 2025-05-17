import { CartService } from "../Config/db";

export interface CartProps{
    id: number;
    user_id: number;//the owner of the card
    total: number;
}

interface CartItemProps{
    id: number;
    card_id: number; // which cart this item belongs to
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
          const initializeResultOk = await this.cartService.insertToCartTable(this.props);
          if(!initializeResultOk){
            throw new Error("Error initializing new cart, from CartModel.initializeCart");
          }
          return true;  
        } catch (error) {
            throw new Error("Error initializing new cart, from CartModel.initializeCart");
        }
    }

};

class CartItemModel{

}