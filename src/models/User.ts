import { Model, Sequelize, DataTypes } from "sequelize";

export class User extends Model{
    id!: number;
    username!: string;
    password!: string;
    socket_id!: string;
    
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
}

export const initUserModel = (sequelize: Sequelize)=>{
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        socket_id: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {sequelize, modelName: "User", tableName: "users", timestamps: false});
}