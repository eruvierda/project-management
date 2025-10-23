import express from 'express';
import connectDB from './config/database.js';
import userRoutes from './routes/users.js';
import workspaceRoutes from './routes/workspaces.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

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
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
