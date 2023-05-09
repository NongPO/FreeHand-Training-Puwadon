const express = require('express');
const mongoose = require('mongoose');
const app = express();

const uri = require = "mongodb+srv://NP_DB:1234@cluster1.v5rzuoi.mongodb.net/?retryWrites=true&w=majority";


async function connect () {
    try{
        await mongoose.connect (uri);
        console.log("Connect to MongoDB");
    } catch(err) {
        console.error(err);
    }
}

connect();


app.listen(8000, () => {
    console.log("server started port 8000");
});