import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../models/user.model";
import { MsgModel } from "../models/message.model";

export const   sequelize=new Sequelize(
    'fs_1',
    'root',
    '',
    {
        dialect:'mysql',
        host:"localhost",
        models:[UserModel,MsgModel]
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