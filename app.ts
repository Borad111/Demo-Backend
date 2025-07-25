import 'reflect-metadata'
import express,{Request,Response,NextFunction} from 'express';
import helmet from 'helmet'
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './routes/user.route'
import { dbConnection } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser'
const app=express();
dotenv.config();


app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(cookieParser());
app.use(helmet());


app.use('/api',userRoute);

app.use(errorHandler);
app.listen(process.env.PORT || 8080,async()=>{
    await dbConnection();
    console.log("Server run on 8080")
});