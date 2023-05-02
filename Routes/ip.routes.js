const express = require('express');
const ipRouter = express.Router()
const axios = require('axios');
const redis = require('../Connection/redis');
const Auth = require('../Middleware/Auth');
const IpModel = require('../Models/ipadresModel');


ipRouter.get("/ipinfo", Auth, async (req, res) => {
    const ip = req.query.ip

    const redisChached = await redis.get(ip)
    if (redisChached) {
        console.log("coming from redis");
        return res.status(201).send(redisChached)

    } else {
        const result = await axios.get(`https://ipapi.co/${ip}/json/`)
        const citydata = result.data
        redis.set(ip, JSON.stringify(citydata), "EX", 60 * 60 * 6)
        console.log("Data From Axios");

        await IpModel.findOneAndUpdate({ userID: req.userID }, {
            userID: req.userID,
            $push: { visitedIP: ip }

        }, { new: true, upsert: true })
        res.status(201).send(citydata)
    }
})

ipRouter.get("/visitedip", Auth, async (req, res) => {
    const data = await IpModel.findOneAndUpdate({ userID: req.userID })
    res.send(data)
})

module.exports = ipRouter