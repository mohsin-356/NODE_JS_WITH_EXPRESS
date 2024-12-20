const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env' });
const Movie=require('./../Models/movieModel');
const fs=require('fs');
// Connect to Database
mongoose.connect(process.env.LOCAL_DB_CONN_STRING)
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.log('DB connection error:', err));
//getting all teh movies fron the json file
const movies= JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));
//importing all movies into the database
const deleteData=async()=>{
    try 
    {
        await Movie.deleteMany();
        console.log('All movies removed');
        
    }
    catch (error)
    {
        console.error('Error importing data', error);
    }
    process.exit();
    // return;
}
const importData=async()=>{
    try
    {
        await Movie.create(movies);
        console.log('All movies saved into DB:"movie"');
    }
    catch (error) 
    {
        console.error('Error importing data', error);
    }
    process.exit();
    // return;
}
if (process.argv[2] === '--import') 
{
    importData();
}
else if (process.argv[2] === '--delete')
{
    deleteData();
}
else
{
    console.error('Please provide a valid command: --import or --delete');
    process.exit(1);
}