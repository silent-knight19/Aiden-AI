import http from 'http';
import dotenv from 'dotenv/config';
import app from './App.js';

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Global error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle server shutdown gracefully
const gracefulShutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    // If server hasn't finished in 10 seconds, shut down forcefully
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);