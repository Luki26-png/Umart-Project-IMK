import { PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const dbAuth: PoolOptions = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST
}
export default dbAuth;