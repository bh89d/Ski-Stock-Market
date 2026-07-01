import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.ts";
import { priceEngine } from "./priceEngine/priceEngine.ts";
import stockRoutes from "./routes/stockRoutes.ts";
import companyRoutes from "./routes/companyRoutes.ts";
import marketRoutes from "./routes/marketRoutes.ts";
import tradeRoutes from "./routes/tradeRoutes.ts";
import portfolioRouter from "./routes/portfolioRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import cors from "cors";

config();
const app = express();

//Security middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));


//Body parsing middlewares
app.use(express.json());

//API routes
app.use("/home", authRoutes);
app.use("/stock", stockRoutes);
app.use("/company", companyRoutes);
app.use("/market", marketRoutes);
app.use("/trade", tradeRoutes);
app.use("/portfolio", portfolioRouter);
app.use("/user", userRoutes)

const PORT = Number(process.env.PORT);

const MARKET_TICK_MS = Number(process.env.MARKET_TICK_MS ?? 5000);


async function startServer() {
  setInterval(async () => {
    try {
      await priceEngine();
    } catch (err) {
      console.error("Market tick failed:", err);
    }
  }, MARKET_TICK_MS);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The server is running on port ${PORT}`)
  });
}

startServer();


