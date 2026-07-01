import prisma  from "../config/db.ts";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { generateToken } from "../utils/generateToken.ts";

export const register = async(req: Request, res: Response) => {
  const {username, password, email} = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Name ,email and password are required"});
  }

  //Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {email: email}
  });

  if (userExists) {
    return res.status(400).json({ error : "User already exists " });
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  //create user
  const registerUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    },
  });

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: registerUser.userId,
        username: username,
        email: email,
      },
    },
  });
}

export const login = async(req: Request, res: Response) => {
  const {username, password} = req.body;

  //Check if username/password is provided
  if (!username || !password) {
    return res.status(401).json({ error: "Username or password is not provided" })
  }

  //Check if user exists in the table
  const userExists = await prisma.user.findUnique({
    where: {username: username},
  });

  if (!userExists) {
    return res.status(401).json({ error: "User or password is incorrect" });
  }

  //Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, userExists.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "User or password is incorrect" });
  }

  //Generate JWT Token
  const token = generateToken(userExists.userId);

  return res.status(200).json({
    status: "success",
    data: {
      userId: userExists.userId,
      username,
      email: userExists.email
    },
    token
  });
}