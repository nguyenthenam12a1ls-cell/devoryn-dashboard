import mongoose, { Schema } from "mongoose";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
    MODERATOR = "moderator"
};

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    refreshToken: {
        type: String,
        default: ""
    }
});

const UserModel = mongoose.model("User", userSchema);


export default UserModel;