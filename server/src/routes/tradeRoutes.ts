import express from "express";
import { buyStock, sellStock } from "../controllers/tradeController";
import { tokenVerification } from "../middlewares/authMiddleware";

const Router = express.Router();

Router.post("/buy", tokenVerification, buyStock);
Router.post("/sell", tokenVerification, sellStock);


export default Router