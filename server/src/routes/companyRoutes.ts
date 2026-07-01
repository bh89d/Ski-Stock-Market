import express from "express";
import { getCompany, getSingleCompany } from "../controllers/compayController.ts";

const router = express.Router();

router.get("/", getCompany);
router.get("/:companyId", getSingleCompany);

export default router;