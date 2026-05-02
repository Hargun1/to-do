const nodemon = require('nodemon');
const mongoose = require('mongoose');

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected successfully');
};
//console.log(process.platform); 
//console.log(process.pid)
module.exports = connectDatabase;
