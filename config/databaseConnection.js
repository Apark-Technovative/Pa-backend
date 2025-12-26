const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDatabase = async() => {
try {
     await mongoose.connect(process.env.MONGODB_URL).then((con) => {
      console.log(
        `MongoDB connected with HOST: ${con.connection.host} and PORT: ${con.connection.port}`
      );
    });
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}}

module.exports = connectDatabase;