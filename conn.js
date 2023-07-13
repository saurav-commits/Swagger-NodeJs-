const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect("mongodb+srv://saurav-55:Kleio321%40@cluster0.hvvjzjo.mongodb.net/Swagger", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

module.exports = connectDB;
