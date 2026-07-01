import type { Response, Request } from "express";
import prisma from "../config/db";

export async function getMarketClock(_req : Request, res : Response) {
  const marketClock = await prisma.marketClock.findUnique({
    where : {id : 1},
    select : {
      currentMarketTick : true,
      currentPhase : true,
      currentTime : true,
      days : true
    }
  })

  if (!marketClock) {
    return res.status(404).json({ error: "Can not get Market clock " })
  }

  return res.status(200).json(marketClock);
}