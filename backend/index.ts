// idk what backend framework we wanna work with

import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BACKEND_PORT; 

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'YouPick API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});