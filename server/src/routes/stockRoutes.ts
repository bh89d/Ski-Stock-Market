import express from "express";
import { getStocks, getStockHistory, getSingleStock } from "../controllers/stockController";

const router = express.Router();

router.get("/", getStocks);
router.get("/:id/history", getStockHistory);
router.get("/:id", getSingleStock);

export default router;