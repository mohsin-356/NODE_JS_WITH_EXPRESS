const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path: './config.env' });
const app=require('./app');
//CONNECT TO Database<Cineflix>
mongoose.connect(process.env.LOCAL_DB_CONN_STRING)
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.log('DB connection error:', err));
//CREATE A SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 