import express from 'express';
//database configuration
import { DatabaseService } from './Config/db';
DatabaseService.init();

//middleware
import cookieParser from 'cookie-parser';
import session from 'express-session';

//routes
import authentication from './Routes/authentication';
import admin from './Routes/admin';
import user from './Routes/user';
import product from './Routes/product';
import homepage from './Routes/homepage';

const app = express();
const port : number = 8080;

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  }
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'pug');
app.set('views', __dirname + "/" + 'Views');

app.get('/', (req, res) => {
    res.redirect('/homepage/');
});

app.get('/login',(_req, res)=>{
  const docPath = __dirname + "/Public/static_html/login.html";
  res.sendFile(docPath);
});

app.get('/register', (_req, res)=>{
  const docPath = __dirname + "/Public/static_html/register.html";
  res.sendFile(docPath);
});

app.use('/authentication', authentication);
app.use('/homepage', homepage);

app.get('/logout', (req, res)=>{
  console.log(req.session);
  req.session.destroy(_err => console.log("session has been destroyed"));
  res.clearCookie("user_id");
  res.redirect('/homepage/');
});

app.use('/user', user);
app.use('/api', product);
app.use('/admin', admin);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});