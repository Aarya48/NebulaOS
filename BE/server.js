require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes=require('./routes/fileRoutes');
const http=require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const initializeSocket= require ("./sockets/cursorSocket")


connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/files',  fileRoutes);

const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});