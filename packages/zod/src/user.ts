import z from "zod"


export const userInputValidation = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})