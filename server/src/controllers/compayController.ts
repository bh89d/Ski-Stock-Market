import type { Request, Response } from "express";
import prisma from "../config/db";

export const getCompany = async (_req: Request, res: Response) => {
  const company = await prisma.company.findMany();
  if (!company) {
    return res.status(400).json({ error: "Company not found" });
  }

  return res.status(200).json({
    status: "success",
    data: company
  });
}

export const getSingleCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  if (typeof companyId !== "string") {
    return res.status(400).json({ error: "Invalid stock id" });
  }
  try {
    await prisma.$transaction(async (tx) => {
      const time = await tx.marketClock.findUnique({
        where : { id: 1 }
      });
      const company = await tx.company.findUnique({
        where: { companyId: companyId },
        include: {
          stock: true,
        }
      });

      return res.status(200).json({
        status: "success",
        data: {company, time}
      })
    })
  } catch (err) {
    return res.status(400).json({ error: err })
  }

}