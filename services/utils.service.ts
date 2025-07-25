import { promise } from "zod";
import { AppError, DuplicateError, InternalError } from "../erros/appError";
import { Response } from "express";

export class UtilsService{
    static async to<T>(promise:Promise<T>):Promise<[Error | null ,T | null]>{
        try {
            const res=await promise;
            return [null,res];
        } catch (error) {
            console.log(error);
            return [error as Error,null]
        }
    }

    static TE(err_message:string,statusCode=500):never{
        if(statusCode===500){
            throw new InternalError(err_message);
        }
        if(statusCode===409){
            throw new DuplicateError(err_message);
        }
        throw new AppError(err_message,statusCode);
    }

    static ReE(res:Response,err:any,code?:number):Response{
        const message=err instanceof Error ? err.message : err;
        const statusCode=code || 500;
        
        return res.status(statusCode).json({
            success:false,
            error:message,
        });
    }

    static ReS(res:Response,data:any,code?:number):Response{
        const statusCode=code || 200;
        return res.status(statusCode).json({
            success:true,
            ...data
        })
    }
}

