import redis from "ioredis";

const redisClient = new redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});


try {
    redisClient.on('connect', () => {
        console.log('Redis connected');
    });
} catch (error) {
    console.error('Redis connection error:', error);
}

export default redisClient;
