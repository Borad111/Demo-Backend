import {  Optional } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { UserModel } from "./user.model";

export interface MsgAttribute{
    id:number,
    message:string,
    userId:number,
}

export interface MsgCreationAttribute extends Optional <MsgAttribute,'id'>{}

@Table({
    tableName:"messages",
    timestamps:true
})
export class MsgModel extends Model<MsgAttribute,MsgCreationAttribute> implements MsgAttribute{
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    id!: number;

    @Column({
        type:DataType.STRING,
        allowNull:false,
    })
    message!: string;

    @ForeignKey(()=>UserModel)
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    userId!: number;

      @BelongsTo(() => UserModel, { as: 'user' })
        user!: UserModel;
}