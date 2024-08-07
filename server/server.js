const express = require('express');
const app = express();

require('dotenv').config();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes');



const passport = require('passport');
const { jwtStrategy } = require('./middleware/passport');

const { handleError, convertToApiError } = require('./middleware/apiError');


const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(mongoUri)
.then(()=>{
    console.log('Mongo Connected....')
})
.catch((err)=>{
    console.log("Mongo not connected...", err);
})


// PARSING
app.use(bodyParser.json())


// SANITIZE

app.use(xss());

app.use(mongoSanitize());


// PASSPORT
app.use(passport.initialize());
passport.use('jwt',jwtStrategy);


//Routes

app.use('/api', routes)


/// error handling
app.use(convertToApiError)
app.use((err,req,res,next)=>{
    handleError(err,res)
})


const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
});