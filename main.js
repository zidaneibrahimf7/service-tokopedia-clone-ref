const dotenv   = require('dotenv')
dotenv.config()

const cors = require('cors')
const bodyParser = require('body-parser')

const port     = process.env.PORT

const express  = require('express')
const mongoose = require('mongoose')
const app      = express()

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Middleware */
morgan = require('morgan') // menggunakan middleware
app.use(morgan('dev'))
// --------- //

app.get('/', (req, res) => {
  res.send(
     `Hello World! 
     Example app listening on http://localhost:${port}`
     )
})

app.use('/api/Videos', require('./src/routes/Videos/route.js'))
app.use('/api/Products', require('./src/routes/Products/route.js'))

async function loadDatabase(){
     try {
          await mongoose.connect(process.env.DATABASE_URL + process.env.DB_NAME, {});
          console.log(`Connected to database: ${process.env.DB_NAME} successfully`);
     } catch (error){
          console.error('Failed to connect to database:', error);
          process.exit(1); // Exit jika gagal koneksi
     }
}

loadDatabase();

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})