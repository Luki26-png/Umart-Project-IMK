import { Request, Response } from "express";
import { OrderDetailModel, OrderItemModel, PaymentDetailModel } from "../Models/orderModel";
import { OrderDetailProps, OrderItemProps, PaymentDetailProps } from "../Models/orderModel";
import { PaymentStatus, OrderItemStatus } from "../Models/orderModel";
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

        const orderItems: OrderItemProps[] = [];
        req.body.orderItems.forEach((item:{ productId:number, productQuantity: number, tenggat:string}) => {
            const currentItem: OrderItemProps = {
                id: Math.round(Math.random() * 1E6),
                order_id: orderDetail.id,
                product_id: item.productId,
                quantity: item.productQuantity,
                tenggat: item.tenggat,
                status: OrderItemStatus.diproses
            }
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
}

export default OrderController;