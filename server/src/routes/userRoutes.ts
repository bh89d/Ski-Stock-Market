import express from "express";
import { tokenVerification } from "../middlewares/authMiddleware";
import { getUserDetails } from "../controllers/userController";

const Router = express.Router();

Router.get("/me", tokenVerification, getUserDetails);

export default Router;