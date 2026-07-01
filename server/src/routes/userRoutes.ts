import express from "express";
import { tokenVerification } from "../middlewares/authMiddleware.ts";
import { getUserDetails } from "../controllers/userController.ts";

const Router = express.Router();

Router.get("/me", tokenVerification, getUserDetails);

export default Router;