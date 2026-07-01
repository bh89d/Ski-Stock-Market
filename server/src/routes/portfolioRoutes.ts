import express from "express";
import { tokenVerification } from "../middlewares/authMiddleware";
import { getPortfolio, getLedger, getSingleStockPortfolio } from "../controllers/portfolioController";

const router = express.Router();

router.get("/", tokenVerification, getPortfolio);
router.get("/ledger", tokenVerification, getLedger);
router.post("/stock", tokenVerification, getSingleStockPortfolio);

export default router;