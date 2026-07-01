import express from "express";
import { getMarketClock } from "../controllers/marketController.ts";

const router = express.Router();

router.get("/clock", getMarketClock);

export default router;