import express from 'express';
import connectDB from './config/database.js';

// Connect to database
connectDB();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! This is the project management backend.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
