import { RowDataPacket } from "mysql2";
import { OrderDetailService, OrderItemService, PaymentDetailService } from "../Config/db";
//import { readOrderId } from "../Config/firebase";

export enum PaymentStatus{
    lunas = "lunas",
    pending = "pending",
}

export enum OrderItemStatus{
    selesai = "selesai",
    gagal = "gagal",
    dikirim = "dikirim",
    diproses = "diproses",
    menunggu = "Menunggu Pembayaran"
}

export interface OrderDetailProps{
    id : number;
    user_id : number;
    payment_id: number;
    total : string;
}

export interface OrderItemProps{
    id: number;
    order_id: number;//Reference to OrderDetailProps.id
    product_id: number;
    quantity: number;
    tenggat: string;
    status: OrderItemStatus;
}

export interface PaymentDetailProps{
    id: number;
    order_id: number;//reference to OrderDetailProps.id
    amount: string;
    status: PaymentStatus;
}

export class OrderDetailModel{
    private orderDetailService: OrderDetailService;
    private props: OrderDetailProps|null;

    public constructor(props: OrderDetailProps|null){
        this.props = props;
        this.orderDetailService = new OrderDetailService();
    }

    public async createOrder():Promise<boolean>{
        if(!this.isOrderDetailProps(this.props)){
            throw new Error("Invalid Props, it must be OrderDetailProps");
        }
        try {
            const createOrderSuccess: boolean = await this.orderDetailService.insertIntoOrderDetailTable(this.props);
            if(!createOrderSuccess){
                throw new Error("Failed to create order");
            }
            console.log("success create new order from OrderDetailModel.createOrder");
            return true;    
        } catch (error) {
            console.log(`error from OrderDetailModel.createOrder:\n ${error}`);
            return false;
        }
    }

    public async getOrder(userId: number):Promise<RowDataPacket[]|null>{
        try{
            const orderData = await this.orderDetailService.retrieveOrderDetailJoinOrderItem(userId);
            if (orderData.length == 0) {
                console.log(`Fail to retrieve order data, user with id ${userId} have no order, from OrderDetailModel.getorder`);
                return null;
            }
            console.log(`success retrieving order data with userId ${userId}, from OrderDetailModel.getorder`)
            return orderData;    
        }catch(error){
            throw new Error(`Error retrieving order data with userId ${userId}\n\n ${error}, from OrderDetailModel.getorder`);
        }
    }

    // public async checkOrderPayment(orderId :number):Promise<boolean>{
    //     try {
    //         const paymentComplete:boolean = await readOrderId(orderId);
    //         if(!paymentComplete){
    //             return false;
    //         }
    //         console.log(`Payment for order id = ${orderId} is complete, from OrderDetailModel.checkOrderPayment`);
    //         return true
    //     } catch (error) {
    //         console.error(`error paying for items with order id ${orderId}, from OrderDetailModel.checkOrderPayment\n ${error}`)
    //         return false;
    //     }
    // }

    private isOrderDetailProps(data:any):data is OrderDetailProps{
        return(
            typeof data.id === "number" &&
            typeof data.user_id === "number" &&
            typeof data.payment_id === "number" &&
            typeof data.total === "string"
        );
    }

    private isNull(data:any): data is null{
        return data == null;
    }
}

export class OrderItemModel{
    private orderItemService: OrderItemService;

    public constructor(){
        this.orderItemService = new OrderItemService();
    }

    public async addOrderItem(props:OrderItemProps){
        try {
            const addOrderItemSuccess: boolean = await this.orderItemService.insertIntoOrderItemTable(props);
            if(!addOrderItemSuccess){
                throw new Error("Failed to add order item");
            }
            console.log("success add new order item from OrderItemModel.addOrderItem");
        } catch (error) {
            throw new Error(`error from OrderItemModel.addOrderItem:\n\n ${error}`);
        }
    }

    public async updateOrderItemStatus(orderId: number, status: OrderItemStatus):Promise<boolean>{
        try {
            const updateOrderStatusSuccess: boolean = await this.orderItemService.updateOrderItemStatus(orderId, status);
            if(!updateOrderStatusSuccess){
                console.log(`fail updating order items status with order_id ${orderId}, from OrderItemModel.updateOrderItemStatus`);
                return false
            }
            console.log(`success updating order items status with order_id ${orderId}, from OrderItemModel.updateOrderItemStatus`);
            return true;
        } catch (error) {
            console.log(`Error updating order items status with order_id ${orderId}, from OrderItemModel.updateOrderItemStatus\n${error}`);
            return false;
        }
    }
}

export class PaymentDetailModel{
    private paymentDetailService: PaymentDetailService;
    private props: PaymentDetailProps|null;

    public constructor(props: PaymentDetailProps|null){
        this.props = props;
        this.paymentDetailService = new PaymentDetailService();
    }

    public async createPayment():Promise<boolean>{
        if(!this.isPaymentDetailProps(this.props)){
            throw new Error("Invalid Props, it must be PaymentDetailProps");
        }
        try {
            const createPaymentSuccess: boolean = await this.paymentDetailService.insertIntoPaymentDetailTable(this.props);
            if(!createPaymentSuccess){
                throw new Error("Failed to create payment, the data type must be PaymentDetailProps");
            }
            console.log("success create new payment from PaymentDetailModel.createPayment");
            return true;    
        } catch (error) {
            console.log(`error from PaymentDetailModel.createPayment:\n ${error}`);
            return false;
        }
    }

    public async getPaymentDetailsByUserId(userId:number):Promise<RowDataPacket[]|null>{
        const orderDetailService = new OrderDetailService();
        const orderItemService = new OrderItemService();
        try {
            let paymentList = await this.paymentDetailService.retrieveByUserId(userId);
            if(paymentList.length == 0){
                console.log(`Error retrieving payment detail for userId = ${userId}. You're payment details is empty. from PaymentDetailModel.getPaymentDetailsByUserId`);
                return null;
            }
            //delete order if they've passed the 24 hour limit
            paymentList.forEach(async (payment)=>{
                if (payment.second_passed > 86400 && payment.status == "pending"){
                    const _successDeleteItem = await orderItemService.deleteByOrderId(payment.order_id);
                    const _successDeletePayment = await this.paymentDetailService.deleteByOrderId(payment.order_id);
                    const _successDeleteOrderDetail = await orderDetailService.deleteById(payment.order_id);
                }
            });

            paymentList = paymentList.filter(payment => payment.second_passed < 86400);
            return paymentList;
        } catch (error) {
            console.log(`Error retrieving list of payment details for user_id = ${userId}. From PaymentDetailModel.getPaymentDetailsByUserId${error}`);
            return null;
        }
    }

    public async updatePaymentDetailStatusLunas(orderId:number):Promise<boolean>{
        try {
            const updateSuccess: boolean = await this.paymentDetailService.updatePaymentDetailStatus(orderId, PaymentStatus.lunas);
            if(!updateSuccess){
                console.log("update payment detail status failed. from PaymentDetailModel.updatePaymentDetailStatusLunas");
                return false;
            }
            console.log("update payment detail status success. from PaymentDetailModel.updatePaymentDetailStatusLunas");
            return true;
        } catch (error) {
            console.log("update payment detail status failed. from PaymentDetailModel.updatePaymentDetailStatusLunas\n", error);
            return false;
        }
    }

    private isPaymentDetailProps(data:any):data is PaymentDetailProps{
        return(
            typeof data.id === "number" &&
            typeof data.order_id === "number" &&
            typeof data.amount === "string" &&
            typeof data.status === "string"
        );
    }

    private isNull(data:any): data is null{
        return data == null;
    }
}