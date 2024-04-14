const mongoose = require('mongoose');
const UserModel = require('./models/userModel');

mongoose.connect(process.env.NODE_ENV === "production"
? keys.mongoURI
: "mongodb://mongodb:27017/crm-coffee", { useUnifiedTopology: true, useNewUrlParser: true, serverSelectionTimeoutMS: 5000, dbName: 'crm-coffee' })
  .then(async () => {
    await UserModel.deleteMany({});

    const user = new UserModel({
      username: 'admin',
      password: 'password',
    });

    await user.save();

    process.exit();
  })
  .catch(err => {
    console.error('Error en la base de datos:', err);
    process.exit(1);
  });
