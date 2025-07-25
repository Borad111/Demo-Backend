import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../models/user.model";
import { MsgModel } from "../models/message.model";
import dotenv from 'dotenv';
dotenv.config();
export const   sequelize=new Sequelize(
  process.env.DB_NAME || 'railway',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306, // 👈 Add this line
    models: [UserModel, MsgModel]
  }
);


export const  dbConnection=async()=>{
    try {
        await sequelize.authenticate();
        console.log("database connected");
    } catch (error) {
        console.log(error)
    }
}