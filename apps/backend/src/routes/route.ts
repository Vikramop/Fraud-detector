import express, { Router } from "express"
import { userSignup } from "../controllers/userSignup.js";
import { userLogin } from "../controllers/userLogin.js";


const router: Router = express.Router();

router.post("/signup", userSignup)
router.post("/login", userLogin)



export default router;