// src/index.ts
import express from 'express';
import {user} from './Models/user'

const app = express();
const port : number = 8080;

app.get('/', (_req, res) => {
  res.send(`Hello Im ${user.name}, I'm ${user.age} years old, I'm also ${user.height} cm`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
