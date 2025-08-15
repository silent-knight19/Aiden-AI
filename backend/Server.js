import http from 'http'
import dotenv from 'dotenv/config'
import app from './App.js'

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});