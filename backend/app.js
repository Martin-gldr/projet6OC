const express = require('express')
const app = express();
//const mongoose = require('mongoose')

app.use((req, res, next)=>{
    res.json({message: "requete reçue"})
})

module.exports = app