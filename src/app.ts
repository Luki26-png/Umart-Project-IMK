import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

//database configuration
import { DatabaseService } from './Config/db';
DatabaseService.init();
//middleware
import cookieParser from 'cookie-parser';
import session from 'express-session';
//firebase listnere
import { watchPayments } from './Config/firebaseListener';

//routes
import authentication from './Routes/authentication';
import admin from './Routes/admin';
import user from './Routes/user';
import product from './Routes/product';
import homepage from './Routes/homepage';
import cart from './Routes/cart';
import order from './Routes/order';
import payment from './Routes/payment';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust as needed
  }
});
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
app.use('/public',express.static(__dirname + '/Public'));
io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id);

  socket.on('join-order-room', (orderId) => {
    const roomName = `order-${orderId}`;
    socket.join(roomName);
    console.log(`🛎️ Client ${socket.id} joined room ${roomName}`);
  });
});

app.set('io', io);

const startWatching = watchPayments(io);
app.set("watchPayments", startWatching);

app.get('/', (_req, res) => {
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

app.get('/about-us', (req, res)=>{
  if (!req.session.user_id) {
    res.render('user/aboutus.pug', {name:null, avatar:null})
    return;
  }
  let userName = req.session.username;
  let avatar = req.session.avatar;
  res.render('user/aboutus.pug',{name:userName, avatar:avatar})
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
app.use('/api', cart);
app.use('/api', order);
app.use('/api', payment);
app.use('/admin', admin);

server.listen(port, () => {
  console.log(`✅ Server + WebSocket listening on http://localhost:${port}`);
});