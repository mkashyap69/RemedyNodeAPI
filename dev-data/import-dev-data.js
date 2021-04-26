const fs = require('fs');
const mongoose = require('mongoose');
const Remedy = require('../models/remedyModel');

require('dotenv').config({ path: './.env' });

const DB = process.env.Database.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully'));

const remedy = JSON.parse(fs.readFileSync('./remedy.json', 'utf-8'));

/* const users = JSON.parse(fs.readFileSync('remedyUser.json', 'utf-8')); */

const importData = async () => {
  try {
    await Remedy.create(remedy);
    /*   await Users.create(users);  */

    console.log('Data successfully imported');
    process.exit();
  } catch (err) {
    console.log(err.msg);
  }
};

const deleteData = async () => {
  try {
    await Remedy.deleteMany(remedy);
    /* await Users.deleteMany(users);  */
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err.msg);
  }
};

if (process.argv[2] === 'import') {
  importData();
} else {
  deleteData();
}
