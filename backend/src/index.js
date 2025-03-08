import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import entryRouter from './routers/entryRouter.js';
import achievementRouter from './routers/achievementRouter.js';
import {errorHandler, notFoundHandler} from './middlewares/errorHandler.js';
import path from 'path';

const hostname = 'localhost';
const port = 3000;
const app = express();

// Static files
app.use('/', express.static('public'));

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/achievements', achievementRouter);

// Serve index.html for root route in production
app.get('/', (req, res) => {
  res.redirect('/src/pages/login.html');
});

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
