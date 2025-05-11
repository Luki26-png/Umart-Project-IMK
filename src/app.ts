// src/index.ts
import express from 'express';
import authentication from './Routes/authentication';

const app = express();
const port : number = 8080;

app.use('/public',express.static(__dirname + '/Public'));
app.set('view engine', 'pug');
app.set('views', __dirname + "/" + 'Views');

app.get('/', (_req, res) => {
    res.send("<h1>Hello world</h1>");
});

app.get('/home', (_req, res)=>{
  res.render("<h1>this is home path</h1>");
});

app.get('/add-produk', (_req, res)=>{
  res.render('admin/tambah_produk.pug')
});

app.use('/authentication', authentication);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
