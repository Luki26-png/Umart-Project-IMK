import mysql, { ConnectionOptions } from 'mysql2/promise'; // Import the promise-based API
import dbAuth from './config';

const access: ConnectionOptions = dbAuth;

async function fetchData(){
  try {
    const connection = await mysql.createConnection(access);
    const [rows, fields] = await connection.execute("SELECT * FROM `products`;");
    console.log(rows);
    await connection.end(); // Close the connection when done
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData().then(():void =>{
    console.log("fetching data complete");
});