// src/index.ts
import express from 'express';
import authentication from './Routes/authentication';

const app = express();
const port : number = 8080;

app.use(express.static('Public'));
app.set('view engine', 'pug');
app.set('views', '/views');

app.get('/', (_req, res) => {
    res.send("<h1>Hello world</h1>");
});

app.use('/authentication', authentication);

app.get('/home', (_req, res)=>{
  res.render("<h1>this is home path</h1>");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
