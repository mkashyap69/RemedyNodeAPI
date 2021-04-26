const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! ✴️ Shutting down...');
  console.log(err.name, err.message, err.stack);

  //slowly shutting down the server then the application
  process.exit(1);
});

const app = require('./app');

const DB = process.env.Database.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, err.stack);
  console.log('UNHANDLED REJECTION! ✴️ Shutting down...');
  server.close(() => {
    //slowly shutting down the server then the application
    process.exit(1);
  });
});
