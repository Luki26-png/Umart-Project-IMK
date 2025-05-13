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
import product from './Routes/product';

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
app.use('/public',express.static(__dirname + '/Public'));
app.set('view engine', 'pug');
app.set('views', __dirname + "/" + 'Views');

app.get('/', (req, res) => {
    //true if use has logged in
    if (req.session.user_id) {
      const userName = req.session.name;
      res.render('user/homepage.pug', {name:userName});
    }else{
      res.render('user/homepage.pug', {name:null});
    }
    
});

app.get('/login',(_req, res)=>{
  const docPath = __dirname + "/login.html";
  res.sendFile(docPath);
});

app.get('/register', (_req, res)=>{
  const docPath = __dirname + "/register.html";
  res.sendFile(docPath);
});

app.get('/logout', (req, res)=>{
  console.log(req.session);
  req.session.destroy(_err => console.log("session has been destroyed"));
  res.clearCookie("user_id");
  res.send("<h1>You've logout</h1>")
});

app.use('/api', product);
app.use('/admin', admin);
app.use('/authentication', authentication);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});