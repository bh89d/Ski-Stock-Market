import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export const tokenVerification = async (req: Request, res: Response, next: NextFunction) => {
  //Read token from the header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  //Verify token and extract user id
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await prisma.user.findUnique({
      where: { userId: decode.id }
    })

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch(error) {
    return res.status(401).json({ error: `Not authorized ${error}`} );
  }
}