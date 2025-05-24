import { Request, Response } from "express";
import { OrderDetailModel, OrderItemModel, PaymentDetailModel } from "../Models/orderModel";
import { OrderDetailProps, OrderItemProps, PaymentDetailProps } from "../Models/orderModel";
import { PaymentStatus, OrderItemStatus } from "../Models/orderModel";
import { CartItemModel } from "../Models/cartModel";
class OrderController{
    public async createOrder(req:Request, res: Response):Promise<void>{
        if (!req.session.user_id) {
            res.json({message:"UnAuthorized"})
            return;
        }
        const orderDetail: OrderDetailProps = {
            id: Math.round(Math.random() * 1E6),
            user_id: req.session.user_id,
            payment_id: Math.round(Math.random() * 1E6),
            total: req.body.total
        }

        //contain list of ordered item from the cart
        const orderItems: OrderItemProps[] = [];
        //initialize a cartItemModel, it used to delete the ordered item from cart
        const cartItemModel = new CartItemModel(<number>req.session.cart_id);

        req.body.orderItems.forEach(async (item:{ productId:number, productQuantity: number, tenggat:string}) => {
            const currentItem: OrderItemProps = {
                id: Math.round(Math.random() * 1E6),
                order_id: orderDetail.id,
                product_id: item.productId,
                quantity: item.productQuantity,
                tenggat: item.tenggat,
                status: OrderItemStatus.menunggu
            }
            //delete the ordered product from cart
            const _deleteItemSuccess:boolean = await cartItemModel.deleteCartItemAfterMakeOrder(currentItem.product_id)
            //push to the orderItems array
            orderItems.push(currentItem);
        })

        const paymentDetail: PaymentDetailProps = {
            id: Math.round(Math.random() * 1E6),
            order_id: orderDetail.id,
            amount:orderDetail.total,
            status: PaymentStatus.pending
        }

        try {
            const orderDetailModel = new OrderDetailModel(orderDetail);
            const orderItemModel = new OrderItemModel();
            const paymentDetailModel = new PaymentDetailModel(paymentDetail);

            const createOrderDetailSuccess: boolean = await orderDetailModel.createOrder();
            const createPaymentDetailSuccess: boolean = await paymentDetailModel.createPayment();
            orderItems.forEach(async(item)=>{
                await orderItemModel.addOrderItem(item);
            });

            if (!createOrderDetailSuccess && !createPaymentDetailSuccess) {
                res.status(500).json({message:"Internal server error"});
                return;
            }
            res.status(200).json({message:"ok"});
        } catch (error) {
            throw new Error("Error from OrderController.createOrder");
        }
    }

    public async showOrder(req: Request, res: Response):Promise<void>{
        if (!req.session.user_id) {
            res.send("<h1>Unauthorized</h1>")
            return;
        }
        const user_id:number = <number>req.session.user_id;
        const userName = req.session.username;
        const avatar = req.session.avatar;
        try {
            const orderDetailModel = new OrderDetailModel(null);
            const orderData = await orderDetailModel.getOrder(user_id)
            if (orderData == null) {
                res.render('user/pesanan.pug', {name:userName, avatar:avatar, order: null})
                return;
            }
            res.render('user/pesanan.pug', {name:userName, avatar:avatar, order: orderData});
        } catch (error) {
            throw new Error(`Error showing an order from OrderController.showOrder\n\n${error}`);
            
        }
    }
}

export default OrderController;