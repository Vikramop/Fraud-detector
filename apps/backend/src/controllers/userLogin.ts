import { userModel } from "@repo/db/userModels";
import { Request, Response } from "express";



export const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;


    try {


        const user = await userModel.findOne({ email });
        console.log(user)
        if (!user) {
            res.status(401).json({
                success: false,
                message: "user doesn't exist"
            })
            return;
        }

        const isPasswordCorrect = await user.checkPassword(password);
        console.log(isPasswordCorrect)
        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: "incorrect password"
            })
            return;
        }
        console.log("asdfgh")
        const accessToken = user.getAccessToken();
        const refreshToken = user.getRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res
            .status(200)
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: "user is looged in",
                refreshToken,
                accessToken
            })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: "error while login"
        })

    }



}