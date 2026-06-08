require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes=require('./routes/fileRoutes');
const http=require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const initializeSocket= require ("./sockets/cursorSocket")
const userRoutes = require("./routes/userRoutes");

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/files',  fileRoutes);
app.use("/api/users", userRoutes);

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