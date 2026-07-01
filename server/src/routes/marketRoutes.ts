import express from "express";
import { getMarketClock } from "../controllers/marketController";

const router = express.Router();

router.get("/clock", getMarketClock);

export default router;