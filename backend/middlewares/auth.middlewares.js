import jwt from "jsonwebtoken";
import redisClient from "../Services/redis.services.js";
export const authuser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.split(" ")[1];
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                error: 'Token has been invalidated'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({
            success: false,
            error: error.name === 'JsonWebTokenError' ? 'Invalid token' : 'Authentication failed'
        });
    }
};    