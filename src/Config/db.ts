import mysql, { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise';
import { ProductProps } from '../Models/productModel';
import { AuthData, RegisterData } from '../Models/authModel';

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
}

export class AuthService{
  public async findUser(data: AuthData):Promise<RowDataPacket[]>{
    const sqlQuery = `
    select id, name, email, role, avatar, address, phone_number from users
    where email = ? and password = ?`;
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