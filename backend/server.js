const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    message: 'Todo API is running',
  });
});

app.use('/api/todos', todoRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);

  if (error.name === 'CastError') {
    return response.status(400).json({ message: 'Invalid todo id' });
  }

  response.status(500).json({ message: 'Something went wrong on the server' });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

startServer();
