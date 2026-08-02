import express from "express"
import { createGetTouch } from "../controllers/getTouch.js";

const getTouchRouter = express.Router();

getTouchRouter.post("/create",createGetTouch)

export default getTouchRouter