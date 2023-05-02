const jwt = require('jsonwebtoken');
const redis = require('../Connection/redis');
require("dotenv").config()



async function Auth(req, res, next) {
    const token = req.headers.authorization
    if (token) {
        const isTokenBlacklisted = await redis.get(token)
        if (isTokenBlacklisted) {
            return res.status(201).send({ "msg": "Login Again" })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (decoded) {
            console.log(decoded);
            req.body.userID = decoded.userID
            req.userID = decoded.userID
            // console.log(req.userID);
            next()
        } else {
            return res.status(401).send({ "msg": "Invalid User,login again" })
        }
    }

}


module.exports = Auth