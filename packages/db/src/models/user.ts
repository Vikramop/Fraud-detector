import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface IUserSchema {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    password: string,
    refreshToken: string | null,
    getAccessToken(): string,
    getRefreshToken(): string,
    checkPassword(password: IUserSchema["password"]): Promise<boolean>
}



const userSchema = new Schema<IUserSchema>({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    refreshToken: { type: String, default: null }
})


userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 12);
    next()
})


userSchema.methods.checkPassword = async function (this: IUserSchema, password: IUserSchema["password"]): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getAccessToken = function (this: IUserSchema): string {

    return jwt.sign({ id: this._id }, "a12f3e98e6f9b2349f86d9e9a73a9b4c8e1dbf2c3d1e4a6d8a9fbdc2738c9abc", { expiresIn: "15m" })

}
userSchema.methods.getRefreshToken = function (this: IUserSchema): string {

    return jwt.sign({ id: this._id }, "93cfba9d8f3ce29d9a47fd103d78e1e2c64a8f79e40f7c3cb56bd102e2f2e721", { expiresIn: "7d" })

}


export const userModel = mongoose.model("user", userSchema);

