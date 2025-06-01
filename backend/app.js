const express = require('express')
const app = express();
const mongoose = require('mongoose')
const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/user')
const path = require('path')

mongoose.connect("mongodb+srv://martin_gldr:password2222@projet6oc.gelhtdz.mongodb.net/?retryWrites=true&w=majority&appName=projet6OC",
    {
        serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => console.log('connexion réussi mongodb'))
.catch(() => console.log('connexion echouée mongodb'))

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes)
app.use("/api/books", booksRoutes )
app.use('/images', express.static(path.join(__dirname, 'images')))
module.exports = app