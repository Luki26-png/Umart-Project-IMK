import express from 'express';
//database configuration
import { DatabaseService } from './Config/db';
DatabaseService.init();
//routes
import authentication from './Routes/authentication';
import admin from './Routes/admin';
import product from './Routes/product';

const app = express();
const port : number = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/public',express.static(__dirname + '/Public'));
app.set('view engine', 'pug');
app.set('views', __dirname + "/" + 'Views');

app.get('/', (_req, res) => {
    res.send("<h1>Hello world</h1>");
});

app.get('/home', (_req, res)=>{
  res.render("<h1>this is home path</h1>");
});

app.use('/api', product);
app.use('/admin', admin);
app.use('/authentication', authentication);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
