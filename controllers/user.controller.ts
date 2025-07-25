import express,{Request,Response,NextFunction} from 'express';
import { UserLoginInput, userLoginValidate, UserMsgInput, userMsgValidate, UserRegisterInput, userRegisterValidate } from '../utils/validate';
import { UserCreationAttribute } from '../models/user.model';
import { ValidationError } from '../erros/appError';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { jwtUtils } from '../utils/jwt.utils';
import { string } from 'zod';
import { AuthenticatReq} from '../middlewares/auth.middleware';
  


export class UserController {


    public static async registerUser(
    req: Request<{}, {}, UserRegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const { errorMsg, success } = userRegisterValidate(body);

      if (!success) {
        console.log(`validation fail ${errorMsg}`);
        throw new ValidationError(errorMsg || "validation fail");
      }

      const [error,user]=await UtilsService.to(UserService.createUser(body));
      if(error){
        console.log(error.message);
        UtilsService.ReE(res,error,500);
        return;
      }

      UtilsService.ReS(res,{message:"User Register Successfully",user},201);
      
    } catch (error) {
      console.log(error);
      next(error);
    }
    }

    public static async loginUser(
      req:Request<{},{},UserLoginInput>,
      res:Response,
      next:NextFunction):Promise<void>{
        try {
          const body=req.body;
          const {errorMsg,success}=userLoginValidate(body);
          if(!success){
            throw new ValidationError(errorMsg || "validation error");
          }     

          const [error,user]=await UtilsService.to(UserService.loginUser(body));

          if(error){
            UtilsService.ReE(res,error.message,500);
            return;
          }

          const token=jwtUtils.generateToken({id:user?.id,email:user?.email});
          res.cookie('token',token,{
            httpOnly:true,
            sameSite: 'strict',
            secure:true,
            maxAge:24*60*60*1000  
          });
          UtilsService.ReS(res,{message:"User Login sucessfully",user},200);
        } catch (error) {
          console.log(error);
          next(error);
        }
    }

    public static async getPrfile(req:Request,res:Response,next:NextFunction):Promise<void>{
      try {
        const token=req.cookies.token;
        if(!token){
          UtilsService.ReE(res,"Token Missing",401);
          return;
        }

        const decoded=jwtUtils.verifyToken(token);
        if(!decoded || !decoded.id){
          UtilsService.ReE(res,"Invalid Token",401);
          return;
        }

        const [error,user]=await UtilsService.to(
          UserService.getProfile(decoded.id)
        );

        if(error){
          UtilsService.ReE(res,error.message,500);
          return;
        }

        UtilsService.ReS(res,{message:"user profile successfully",user},200);
        
      } catch (error) {
        console.log(error);
        next(error);
      }
    }

  
    public static async createMsg(req:AuthenticatReq<UserMsgInput>,res:Response,next:NextFunction):Promise<void>{
      try {
        const body=req.body;
        if(!body){
          UtilsService.ReE(res,{message:"messsage field is required"},400);
          return;
        }
        const {success,errorMsg}=userMsgValidate(body);
        if(!success){
          throw new ValidationError(errorMsg || "Validation Failed");
        }

        const id=req.user?.id;
        if(!id){
          UtilsService.ReE(res,"Id is Missing",401);
          return;
        }
        const [error,user]=await UtilsService.to(UserService.createMsg(id,body));

        if(error){
          UtilsService.ReE(res,error,500);
          return;
        }

        UtilsService.ReS(res,{message:"message created Sucessfully",user},200);
      } catch (error) {
        console.log(error)
        next(error)
      }
    }

    public static async logout(req:Request,res:Response,next:NextFunction):Promise<void>{
      try {
          res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"strict"
          });

          UtilsService.ReS(res,{message:"logout successfully"},200);
      } catch (error) {
        console.log(error);
        next(error)
      }
    }

    public static async getAllMesgs(req:Request,res:Response,next:NextFunction):Promise<void>{
      try {
        const page=parseInt(req.query.page as string) || 1;
        const limit=parseInt(req.query.limit as string) || 10;
        const offset=(page-1)*limit;
        const [error,result]=await UtilsService.to(UserService.fetchMsgs(limit,offset));
        if(error){
          UtilsService.ReE(res,error,500);
          return;
        }
        const {msgs,totalCount}=result;
        UtilsService.ReS(res,{message:"Successfully Msg get",msgs,totalCount},200);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }

    public static async getMsg(req:AuthenticatReq,res:Response,next:NextFunction):Promise<void>{
      try {
        const user=req.user;
        if(!user){
          UtilsService.ReE(res,"UnAuthorized access",401);
          return;
        }
        const [error,msgs]=await UtilsService.to(UserService.fetchUserMsg(user.id));

        if(error){
          UtilsService.ReE(res,error,500);
          return;
        }
        UtilsService.ReS(res,{message:"msg get Successfully",msgs},200)
      } catch (error) {
        console.log(error);
        next(error)
      }
    }

    public static async deletemsg(req:Request<{id:string},{},{},{}>,res:Response,next:NextFunction):Promise<void>{
      try {
        const {id}=req.params;
        if(!id){
          UtilsService.ReE(res,"Id not get",401);
          return;
        }
        const numericId=Number(id);
        const [error,msg]=await UtilsService.to(UserService.deleteMsg(numericId));
        if(error){
          UtilsService.ReE(res,error,500);
          return;
        }
        UtilsService.ReS(res,{message:"Msg delete Successfully"},200);
      } catch (error)  {
        console.log(error);
        next(error);
      }
    }

    public static async updateMsg(req:Request<{id:string},{},UserMsgInput>,res:Response,next:NextFunction):Promise<void>{
      try {
        const {id}=req.params;
        if(!id){
          UtilsService.ReE(res,"Id not get",401);
          return;
        }
        const numericId=Number(id);
        const body=req.body;
          const {success,errorMsg}=userMsgValidate(body);
        if(!success){
          throw new ValidationError(errorMsg || "Validation Failed");
        }
        const [error,msg]=await UtilsService.to(UserService.updateMsg(numericId,body));
        if(error){
          UtilsService.ReE(res,errorMsg,500);
          return;
        } 
        UtilsService.ReS(res,{message:"Msg updated Successfully"},200);       
    }
    catch (error) {
      console.log(error);
      next(error);
    }
    }  
}