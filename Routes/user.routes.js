const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config()

const UserModel = require('../Models/userModel');
const redis = require('../Connection/redis');
const userRoute = express.Router()

userRoute.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const isUserPresent = await UserModel.findOne({ email })
        if (isUserPresent) {
            return res.status(401).send({ "msg": "Already Registerd ,Login Directly" })
        }
        bcrypt.hash(password, 3, async (err, hash) => {
            const newuser = new UserModel({ name, email, password: hash })
            await newuser.save()

        })
        res.status(201).send({ "msg": "registration Succesfull" })


    } catch (error) {
        res.status(401).send({ "msg": error.message })
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).send({ "msg": "Regiter First" })

        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ "userID": user._id }, process.env.SECRET_KEY, { expiresIn: "1hr" })
                res.status(201).send({ "msg": "Login Succcesfull", token })
            } else {
                res.status(201).send({ "msg": "Login Failed" })

            }
        })


    } catch (error) {
        res.status(401).send({ "msg": error.message })

    }
})
userRoute.post("/logout", async (req, res) => {
    const token = req.headers.authorization

    if (token) {

        redis.set(token, 1, "EX", 60 * 60)
        res.status(201).send({ "msg": "Logout Succesfully" })

    } else {
        return res.status(201).send({ "msg": "Token Is Not Present" })
    }

   
})


module.exports = userRoute