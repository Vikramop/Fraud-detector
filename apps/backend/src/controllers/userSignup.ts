import { Request, Response } from "express";
// import { userInputValidation } from "@repo/zod/types"
import { userModel } from "@repo/db/userModels";


export const userSignup = async (req: Request, res: Response) => {
    // const requestBody = userInputValidation.safeParse(req.body);
    const { name, email, password } = req.body;

    // if (!requestBody) {
    //     res.status(401).json({
    //         success: false,
    //         message: "invalid input"
    //     })
    //     return
    // }

    try {

        const user = await userModel.findOne({ email });
        if (user) {
            res.status(301).json({
                success: false,
                message: "user already exist"
            })
            return
        }

        // create the user

        await userModel.create({
            name,
            email,
            password
        })

        res.status(200).json({
            success: true,
            message: "user is created"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }

}


