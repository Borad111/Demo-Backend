import {boolean, z, ZodError} from 'zod'

function parseZodError(error:ZodError):string{
    const firstError=error.errors[0];
    const errormsg=firstError ? `${firstError.path.join('.')} - ${firstError.message}` :  "Invalid data";

    return errormsg;
}


export const userRegisterSchema=z.object({
    username:z.string().min(5,"userName minimun 5 letters"),
    email:z.string().email('Invalid email address'),
    password:z.string().min(5,"minimum 5 letter required"),  
});
export type UserRegisterInput=z.infer<typeof userRegisterSchema>
export function userRegisterValidate(data:UserRegisterInput):{errorMsg?:string,success:boolean}{
    const result=userRegisterSchema.safeParse(data);

    if(!result.success){
        const errormsg=parseZodError(result.error);
        return {errorMsg:errormsg,success:false};
    }

    return {success:true}
}



export const LoginSchema=z.object({
    email:z.string().email('Invalid email address'),
    password:z.string().min(1,"password is required")
});
export type UserLoginInput=z.infer<typeof LoginSchema>
export function userLoginValidate(data:UserLoginInput):{errorMsg?:string ,success:boolean}{
    const result=LoginSchema.safeParse(data);

    if(!result.success){
        const errormsg=parseZodError(result.error);
        return {errorMsg:errormsg,success:false};
    }
    return {success:true}
}



const MessageSchema=z.object({
    message:z.string().min(10,"minimum 10 letter required")
});
export type UserMsgInput=z.infer<typeof MessageSchema>
export function userMsgValidate(data:UserMsgInput):{errorMsg?:string,success:boolean}{
    const result=MessageSchema.safeParse(data);

    if(!result.success){
        const errormsg=parseZodError(result.error);
        return {errorMsg:errormsg,success:false};
    }
    return {success:true}
}
