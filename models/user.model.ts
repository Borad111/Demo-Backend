import {  Optional} from "sequelize";
import { Column,Model, DataType, Table, HasMany } from "sequelize-typescript";
import { MsgModel } from "./message.model";

    interface UserAttribute{
        id:number,
        username:string,
        email:string,
        password:string,
        role?:number
    }   

    export interface UserCreationAttribute extends Optional<UserAttribute,'id'> {}

@Table({
    tableName:'users',
    timestamps:true
})

export class UserModel extends Model<UserAttribute,UserCreationAttribute> implements UserAttribute{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    id!: number;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    username!: string;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    email!: string;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    password!: string;

    


    @HasMany(()=>MsgModel)
    messages!:MsgModel[];


    @Column({
        type:DataType.INTEGER,
        defaultValue:1  
    })
    role?: number ;

    
    
}