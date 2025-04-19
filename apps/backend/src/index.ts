
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "@repo/db/index"
import router from "./routes/route.js"


const app = express();
const port = 8080
app.use(express.json())
app.use(cors({ credentials: true }))
app.use(cookieParser());


// connect to db

connectDB();

app.use("/api/v1", router)


app.listen(port, () => { console.log(`listening on port : ${port}.........`) })