import type { Request, Response } from "express";
import prisma from "../config/db";

export async function getUserDetails(req : Request, res : Response) {
  const userName = req.user?.username;

  if (typeof userName !== "string") {
    return res.status(404).json( { err : "Username is Invalid " })
  }

  try{

  const user = await prisma.user.findUnique({
    where : { username : userName },
    select : {
      userId : true,
      username : true,
      balance : true
    }
  });

  return res.status(200).json({
    status : "success",
    data : user
  });

  } catch (err) {
    return res.status(400).json({error : err});
  }
}