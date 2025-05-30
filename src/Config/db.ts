import mysql, { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise';
import { ProductProps } from '../Models/productModel';
import { AuthData, RegisterData } from '../Models/authModel';
import { UserUpdateProps } from '../Models/userModel';
import { CartProps, CartItemProps } from '../Models/cartModel';
import { OrderDetailProps, OrderItemProps, OrderItemStatus, PaymentDetailProps, PaymentStatus } from '../Models/orderModel';

import dbAuth from './config';

export class DatabaseService {
  private static pool: Pool;

  // Initialize pool once
  public static init() {
    if (!this.pool) {
      this.pool = mysql.createPool(dbAuth as PoolOptions);
      console.log("Connection pool created");
    }
  }

  // Get the pool to use in queries
  public static getPool(): Pool {
    if (!this.pool) throw new Error("Database pool not initialized. Call DatabaseService.init() first.");
    return this.pool;
  }
}

export class ProductService {
  public async insertToProductTable(props:ProductProps){
    const sqlQuery = `
    INSERT INTO products (id, name, description, price, summary, cover, category) VALUES
    (?,?,?,?,?,?,?);`;
    
    const values = [
      props.id,
      props.name,
      props.description,
      props.price,
      props.summary,
      props.cover,
      props.category
    ];

    try {
      const pool = DatabaseService.getPool();
      const [result, fields] = await pool.query(sqlQuery, values);
      console.log(`successfully add new product, from ProductService.insertToProductTable`)
      console.log("Database Operation Result", result);
      console.log("Database Operation Field", fields);
    } catch (error) {
      console.log("Error in insertToProductTable:", error);
    }
  }

  public async retrieveOneData(id:number):Promise<RowDataPacket[]>{
    const sqlQuery = `select * from products where id = ?`;
    const values : number[] = [id];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      return rows;
    } catch (error) {
      console.log("Error in retrieving product data in ProductService.retrieveOneData\n", error);
      return []
    }
    
  }

  public async retrieveByName(productName:string):Promise<RowDataPacket[]>{
    const sqlQuery = `select id, name, cover, summary from products where name like ?;`;
    const values = [`%${productName}%`];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      return rows;
    } catch (error) {
      console.log("Error in searching product data in ProductService.retrieveByName\n", error);
      return []
    }
  }

  public async retriveProductCardData(limit:number):Promise<RowDataPacket[]>{
    const sqlQuery = `select id, name, summary, cover, category from products limit ?`;
    const values : number[] = [limit];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`retrieve ${rows.length} product data, from ProductService.retrieveProductCardData`);
      // console.log(fields);
      return rows;
    } catch (error) {
      console.log("Error in retrieving product data in ProductService.retrieveProductCardData\n", error);
      return []
    }
  }

  public async retrieveProductCardDataExcludingId(limit: number, idToExclude: number): Promise<RowDataPacket[]> {
    const sqlQuery = `
    SELECT id, name, summary, cover, category FROM products
    WHERE id != ? LIMIT ?;`;
    const values : number[] = [idToExclude, limit];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`Retrieved ${rows.length} product cards excluding ID: ${idToExclude}, from ProductService.retrieveProductCardDataExcludingId`);
      return rows;
     
    } catch (error) {
      console.log("Error in finding product cards excluding ID in ProductService.retrieveProductCardDataExcludingId\n", error);
      return []
    }
  }
}

export class AuthService{
  public async findUser(data: AuthData):Promise<RowDataPacket[]>{
    const sqlQuery = `
      select 
      users.id, users.name, users.email, users.role, 
      users.avatar, users.address, users.phone_number, 
      carts.id as cart_id 
      from users
      inner join carts on users.id = carts.user_id
      where email = ? and password = ?;`;
    const values : string[] = [data.email, data.password];

    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`user with ${data.email} found, from AuthService.findUser`);
      // console.log(fields);
      return rows;
    } catch (error) {
      console.log("Error in finding the users in AuthService.findUser\n", error);
      return []
    }
  }

  public async registerNewUser(data: RegisterData):Promise<boolean>{
    const sqlQuery = `
    INSERT INTO users (id, name, email, role, password) VALUES
    (?,?,?,?,?);`;
    const values = [data.id, data.name,data.email, data.role, data.password];

    try {
      const pool = DatabaseService.getPool();
      const [result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success registering new User, from AuthService.registerNewUser");
      console.log(result);
      //console.log(fields);
      return true;
    } catch (error) {
      console.log("Error in registering new User in AuthService.registerNewUser\n", error);
      return false;
    }
  }
}

export class UserService{
  public async updateUserTable(updatedData: UserUpdateProps, id:number):Promise<boolean>{
    const setClauses: string[] = [];
    const queryValues: (string | number | null)[] = [];

    for (const [key, value] of Object.entries(updatedData)) {
      // Only include fields that are not null or undefined.
      // This allows explicitly setting a field to an empty string if desired,
      // but skips fields that weren't provided for update (i.e., are null/undefined).
      if(value !== null && value !== undefined){
        setClauses.push(`${key} = ?`);
        queryValues.push(value);
      }
    }

    // If there are no fields to update, we can consider it a success (no-op)
    if (setClauses.length === 0) {
      console.log(`No valid fields to update for user ${id}.`);
      return true;
    }

    // Construct the SET part of the query
    const setClauseString = setClauses.join(', ');

    // Add the user ID for the WHERE clause
    queryValues.push(id);

    const sqlQuery = `UPDATE users SET ${setClauseString} WHERE id = ?`;
    
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, queryValues);
      console.log(`User ${id} updated successfully. from UserService.updateUserTable`);
      //console.log(`Database Operation Result:`, result);
      // A more robust check could be: (result as any).affectedRows > 0
      return true; 
    } catch (error) {
      console.error(`Error updating user ${id} in UserService.updateUserTable:`, error);
      return false;
    }
  }
}

//dealing with cart table
export class CartService{
  public async insertToCartTable(props:CartProps):Promise<boolean>{
    const sqlQuery = `INSERT INTO carts (id, user_id, total) VALUES (?,?,?);`;
    const values : number[] = [props.id, props.user_id, props.total];
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success initializing new cart, from CartService.insertToCartTable");
      //console.log(result);
      //console.log(fields);
      return true;
    } catch (error) {
      throw new Error("Error initializing new cart in CartService.insertToCartTable");
    }
  }
}

//dealing with cart item table
export class CartItemService{
  public async insertToCartItemTable(props: CartItemProps):Promise<boolean>{
    const sqlQuery = `INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES (?,?,?,?);`;
    const values : number[] = [props.id, props.cart_id, props.product_id, props.quantity];
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success adding new item to cart_items, from CartItemService.insertToCartItemTable");
      return true;
    } catch (error) {
      console.error("Error adding new item to cart_items, from CartItemService.insertToCartItemTable\n", error);
      return false;
    }
  }

  public async isItemInCart(cart_id: number, product_id: number):Promise<boolean>{
    const sqlQuery = `SELECT id FROM cart_items WHERE cart_id = ? and product_id = ?;`;
    const values : number[] = [cart_id, product_id];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      if (rows.length == 0) {
        return false;
      }
      return true;
    } catch (error) {
        console.error("Fail to check for Item in a a cart, from CartItemService.isItemInCart");
        return false;
    }
  }

  public async deleteFromCartItemTable(cartItemId:number):Promise<boolean>{
    const sqlQuery = `delete from cart_items where id = ?`;
    const values : number[] = [cartItemId];
    try {
      const pool = DatabaseService.getPool();
      const [_rows, _fields] = await pool.query(sqlQuery, values);
      console.log(`success deleting cart item with id = ${cartItemId}, from CartItemService.deleteFromCartItemTable`);
      return true;
    } catch (error) {
      console.error(`Fail to delete cart item with id = ${cartItemId}, from CartItemService.deleteFromCartItemTable`);
      return false;
    }
  }

  public async deleteCartItemWithCartAndProductId(cartId:number, productId:number):Promise<boolean>{
    const sqlQuery = `delete from cart_items where cart_id = ? and product_id = ?`;
    const values : number[] = [cartId, productId];
    try {
      const pool = DatabaseService.getPool();
      const [_rows, _fields] = await pool.query(sqlQuery, values);
      console.log(`success deleting cart item with cartId = ${cartId} and productId = ${productId}, from CartItemService.deleteCartItemWithCartAndProductId`);
      return true;
    } catch (error) {
      console.error(`Fail deleting cart item with cartId = ${cartId} and productId = ${productId}, from CartItemService.deleteCartItemWithCartAndProductId`);
      return false;
    }
  }

  public async retrieveCartItemTable(cartId: number):Promise<RowDataPacket[]>{
    const sqlQuery = `
    SELECT
      CART_ITEMS.id,
      CART_ITEMS.product_id,
      PRODUCTS.name,
      PRODUCTS.summary,
      PRODUCTS.cover,
      PRODUCTS.price,
      CART_ITEMS.quantity
    FROM
      CART_ITEMS
    INNER JOIN
      PRODUCTS ON PRODUCTS.id = CART_ITEMS.product_id
    WHERE
      cart_id = ?;
    `;
    const values : number[] = [cartId];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`Success retrieving cart items with cart id = ${cartId}, CartItemService.retrieveCartItemTable`);
      return rows;
    } catch (error) {
      console.error(`Error retrieving cart items with id = ${cartId}, CartItemService.retrieveCartItemTable`);
      return [];
    }
  }
}

export class OrderDetailService{
  public async insertIntoOrderDetailTable(props: OrderDetailProps):Promise<boolean>{
    const sqlQuery = `INSERT INTO order_details (id, user_id, payment_id, total) VALUES (?,?,?,?);`;
    const values : (number|string)[] = [props.id, props.user_id, props.payment_id, props.total];
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success adding new order to order_details, from OrderDetailService.insertIntoOrderDetailTable");
      return true;
    } catch (error) {
      console.error("Error adding new item to order_details, from OrderDetailService.insertIntoOrderDetailTable\n", error);
      return false;
    }
  }

  public async deleteById(id:number):Promise<boolean>{
    const sqlQuery = `delete from order_details where id = ?`;
    const values : number[] = [id];
    try {
      const pool = DatabaseService.getPool();
      const [_rows, _fields] = await pool.query(sqlQuery, values);
      console.log(`success deleting order order_details with id = ${id}, from OrderDetailService.deleteById`);
      return true;
    } catch (error) {
      console.error(`Fail to delete order order_details with id = ${id}, from OrderDetailService.deleteById\n${error}`);
      return false;
    }
  }

  public async retrieveOrderDetailJoinOrderItem(userId:number):Promise<RowDataPacket[]>{
    const sqlQuery = `
      select
        (od.id) as order_details_id, -- alias for clarity
        (od.user_id),
        (od.total) as order_total, -- alias for clarity
        (oi.id) as order_item_id,   -- alias for clarity
        (oi.product_id),
        (p.name) as product_name, -- added products.name here
        (oi.quantity),
        (oi.tenggat),
        (oi.status) as order_item_status, -- alias for clarity
        (pd.id) as payment_detail_id  -- alias for clarity
      from
        order_details as od
      inner join
        order_items as oi on od.id = oi.order_id
      inner join
        payment_details as pd on od.id = pd.order_id
      inner join
        products as p on oi.product_id = p.id -- joined products table
      where
        od.user_id = ?;
    `;
    const values: number[] = [userId];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`Success retrieving order with user id = ${userId}, OrderDetailService.retrieveOrderDetailJoinOrderItem`);
      return rows;
    } catch (error) {
      console.log(`Error retrieving order with user id = ${userId}, OrderDetailService.retrieveOrderDetailJoinOrderItem\n${error}`);
      return[];
    }
  }
}

export class OrderItemService{
  public async insertIntoOrderItemTable(props: OrderItemProps):Promise<boolean>{
    const sqlQuery = `INSERT INTO order_items (id, order_id, product_id, quantity, tenggat, status) VALUES (?,?,?,?,?,?);`;
    const values = [props.id, props.order_id, props.product_id, props.quantity, props.tenggat, props.status];
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success adding new order to order_items, from OrderItemService.insertIntoOrderItemTable");
      return true;
    } catch (error) {
      console.error("Error adding new item to order_items, from OrdeItemService.insertIntoOrderItemTable\n", error);
      return false;
    }
  }

  public async deleteByOrderId(order_id:number):Promise<boolean>{
    const sqlQuery = `delete from order_items where order_id = ?`;
    const values : number[] = [order_id];
    try {
      const pool = DatabaseService.getPool();
      const [_rows, _fields] = await pool.query(sqlQuery, values);
      console.log(`success deleting order items with order_id = ${order_id}, from OrderItemService.deleteByOrderId`);
      return true;
    } catch (error) {
      console.error(`Fail to delete order items with order_id = ${order_id}, from OrderItemService.deleteByOrderId\n${error}`);
      return false;
    }
  }

  public async updateOrderItemStatus(orderId:number, status: OrderItemStatus):Promise<boolean>{

    const sqlQuery = `UPDATE order_items SET status = ? WHERE order_id = ?`;
    const values = [status, orderId]
    
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log(`order items status with order id ${orderId}} updated successfully. from OrderItemService.updateOrderItemStatus`);
      //console.log(`Database Operation Result:`, result);
      // A more robust check could be: (result as any).affectedRows > 0
      return true; 
    } catch (error) {
      console.error(`Error updating order items status with order id ${orderId}}, from OrderItemService.updateOrderItemStatus`, error);
      return false;
    }
  }
}

export class PaymentDetailService{
  public async insertIntoPaymentDetailTable(props:PaymentDetailProps):Promise<boolean>{
    const sqlQuery = `INSERT INTO payment_details (id, order_id, amount, status) VALUES (?,?,?,?);`;
    const values = [props.id, props.order_id, props.amount, props.status];
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log("Success adding new order to payment_details, from PaymentDetailService.insertIntoPaymentDetailTable");
      return true;
    } catch (error) {
      console.error("Error adding new item to payment_details, fromPaymentDetailService.insertIntoPaymentDetailTable\n", error);
      return false;
    }
  }

  public async retrieveByUserId(userId:number):Promise<RowDataPacket[]>{
    const sqlQuery = `
    select 
      od.id as order_id,
      od.user_id,
      pd.id as payment_id,
      pd.amount,
      pd.status,
      TIMESTAMPDIFF(SECOND, pd.created_at, NOW()) AS second_passed
    from order_details as od
    inner join 
      payment_details as pd on od.id = pd.order_id
    where 
      od.user_id = ?;
    `;
    const values : number[] = [userId];
    try {
      const pool = DatabaseService.getPool();
      const [rows, _fields] = await pool.query<RowDataPacket[]>(sqlQuery, values);
      console.log(`Success retrieve payment detail with user_id ${userId}`);
      return rows;
    } catch (error) {
      console.log(`Error retrieving payment details with user_id ${userId}, from PaymentDetailService.retrieveByUserId\n${error}`)
      return []
    }
  }

  public async deleteByOrderId(order_id:number){
    const sqlQuery = `delete from payment_details where order_id = ?`;
    const values : number[] = [order_id];
    try {
      const pool = DatabaseService.getPool();
      const [_rows, _fields] = await pool.query(sqlQuery, values);
      console.log(`success deleting order payment_details with order_id = ${order_id}, from PaymentDetailService.deleteByOrderId`);
      return true;
    } catch (error) {
      console.error(`Fail to delete order payment_details with order_id = ${order_id}, from PaymentDetailService.deleteByOrderId\n${error}`);
      return false;
    }
  }

  public async updatePaymentDetailStatus(orderId:number, status: PaymentStatus):Promise<boolean>{

    const sqlQuery = `UPDATE payment_details SET status = ? WHERE order_id = ?`;
    const values = [status, orderId]
    
    try {
      const pool = DatabaseService.getPool();
      const [_result, _fields] = await pool.query(sqlQuery, values);
      console.log(`payment details status with order id ${orderId}} updated successfully. from PaymentDetailService.updatePaymentDetailStatus`);
      //console.log(`Database Operation Result:`, result);
      // A more robust check could be: (result as any).affectedRows > 0
      return true; 
    } catch (error) {
      console.error(`Error updating order items status with order id ${orderId}}, from PaymentDetailService.updatePaymentDetailStatus`, error);
      return false;
    }
  }
}