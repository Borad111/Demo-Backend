    import { Request,Response,NextFunction } from "express";
    import { UtilsService } from "../services/utils.service";
    import { jwtUtils } from "../utils/jwt.utils";
    interface User{
      id:number,
      email:string
    }

    export interface AuthenticatReq<T = any> extends Request{
        user?:User;
        body:T
    }

    export const authenticateJwt=(req:AuthenticatReq,res:Response,next:NextFunction)=>{
        const token=req.cookies.token;

        if(!token){
         UtilsService.ReE(res,"Token missing",401);
         return;
        }

        try {
            const decode=jwtUtils.verifyToken(token);
            req.user=decode;
            next();
        } catch (error) {
             UtilsService.ReE(res,"Unauthorized",401);
             return;
        }
    }