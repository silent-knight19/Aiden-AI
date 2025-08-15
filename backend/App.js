import express from "express";
import morgan from "morgan";
import connect from './DataBase/db.js';
import userRoutes from './Routes/User.routes.js';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.get('/', (req,res)=>{
    res.send('hello world');
});

app.use('/api/user', userRoutes);
connect();
export default app;