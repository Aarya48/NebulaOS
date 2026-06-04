require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes=require('./routes/fileRoutes');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/files',  fileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});