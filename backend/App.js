import express from "express";
import morgan from "morgan";
import connect from './DataBase/db.js';
import userRoutes from './Routes/User.routes.js';
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.get('/', (req,res)=>{
    res.send('hello world');
});

app.use('/user', userRoutes);
connect();
export default app;