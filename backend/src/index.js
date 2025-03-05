import express from 'express';
import cors from 'cors';

const hostname = 'localhost';
const port = 3000;
const app = express();

app.use('/', express.static('public'));

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Start server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
