import jwt from "jsonwebtoken";
import redisClient from "../Services/redis.services.js";
export const authuser= async (req, res, next) => {
    try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1] ;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }
};   