const express = require('express');
const connection = require('./Connection/connection');
const userRoute = require('./Routes/user.routes');
const winston = require('winston');
require("dotenv").config()
const expresswinston = require("express-winston");
const ipRouter = require('./Routes/ip.routes');
require("winston-mongodb")
const app = express()
app.use(express.json())
app.use(expresswinston.logger({
    transports:[
        new winston.transports.MongoDB({
            json:true,
            colorize:true,
            db:process.env.MONGO_URL,
            level:"error"
        })
    ],format:winston.format.prettyPrint()
}))




app.use("/user",userRoute)

app.use("/address",ipRouter)


app.listen(8080, async () => {
    try {
        await connection
        console.log("Connected to Database Succesfully");
    } catch (error) {
        console.log("Error While Connecting to DB");
        console.log(error);
    }
    console.log("server is connected to Port No 8080");
})