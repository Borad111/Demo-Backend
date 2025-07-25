import { util } from "zod";
import { UserCreationAttribute, UserModel } from "../models/user.model";
import { UserLoginInput, UserMsgInput } from "../utils/validate";
import { UtilsService } from "./utils.service";
import bcrypt from 'bcryptjs';
import { MsgAttribute, MsgModel } from "../models/message.model";


export class UserService{

    static async createUser(body:UserCreationAttribute):Promise<UserModel>{
        let [err,user]=await UtilsService.to(
            UserModel.findOne({
                where:{
                    email:body.email
                }
            })
        );

        if(err){
            UtilsService.TE(err.message);
        };
        if(user){
            UtilsService.TE("User Already Exit",409);
        };

        body.password=bcrypt.hashSync(body.password,10);
        
        [err,user]=await UtilsService.to(UserModel.create(body));

        if(err){
            UtilsService.TE(err.message);
        }
        return user!;
    }

  
    static async loginUser(body:UserLoginInput):Promise<UserModel>{
        let [err,user]=await UtilsService.to(
            UserModel.findOne({
                where:{
                    email:body.email
                }
            })
        );

        if(err){
            UtilsService.TE(err.message);
        }
        if(!user || !user.password){
            UtilsService.TE("User Not Found");
        }

        const isMatch=await bcrypt.compare(body.password,user.password);
        if(!isMatch){
            UtilsService.TE("Invalid Credentials");
        }
        
        return user;
    }

    static async getProfile(id:number):Promise<UserModel | null>{
        let [err,user]=await UtilsService.to(UserModel.findByPk(id));
        if(err){
            UtilsService.TE(err.message);
        }
        return user;
    }

    static async createMsg(id:number,body:UserMsgInput):Promise<MsgModel>{
        const  payload={
            message:body.message,
            userId:id
        }
        let [err,user]=await UtilsService.to(MsgModel.create(payload));

        if(err){
            UtilsService.TE(err.message);
        }
        return user!;
    }

    static async fetchMsgs(limit:number,offset:number):Promise<MsgModel [] | null>{
        const [error,Msgs]=await UtilsService.to(MsgModel.findAll({
            include:[
                {
                    model:UserModel,
                    as:'user',
                    attributes:['username','email']
                 }
            ],
            limit,
            offset,
            order:[['createdAt','DESC']],
        }));
        if(error){
            UtilsService.TE(error.message);
        }
        const totalCount=await MsgModel.count();
        return {msgs:Msgs!,totalCount};
    }

    static async fetchUserMsg(id:number):Promise<MsgAttribute[] | null>{
        if(!id){
            UtilsService.TE("Cannot get User Id");
        }
        const [error,msg]=await UtilsService.to(MsgModel.findAll({
                where:{
                    userId:id
                },
        }));
        if(error){
            UtilsService.TE(error.message);
        }
        return msg;
    }

    static async deleteMsg(id:number):Promise<void>{
        const [error,msg]=await UtilsService.to(MsgModel.destroy({
            where:{
                id:id
            }
        }));

        if(error){
            UtilsService.TE(error.message);
        }

        if(msg===0){
            UtilsService.TE("Masg is not deleted ")
        }
    }

    static async updateMsg(id:number,body:UserMsgInput):Promise<MsgAttribute>{
        const [error,msg]=await UtilsService.to(MsgModel.findByPk(id));
        if(error){
            UtilsService.TE(error.message);
        }
        if(!msg){
            UtilsService.TE("Message not found");
        }

        msg.message=body.message;
        const [updateError,updatedMsg]=await UtilsService.to(msg.save());
        if(updateError){
            UtilsService.TE(updateError.message);
        }
        if(!updatedMsg){
            UtilsService.TE("Message not updated");
        }
        return updatedMsg.toJSON();
    }
}