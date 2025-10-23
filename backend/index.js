import express from 'express';
import connectDB from './config/database.js';
import userRoutes from './routes/users.js';

// Connect to database
connectDB();

const app = express();

// Init Middleware
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! This is the project management backend.');
});

// Define Routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
