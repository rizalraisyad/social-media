import { NextFunction, Request, Response } from "express";
import UserModel from "../db/models/user";
import express from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  let { user } = req;

  const result = await UserModel.getUser(
    user.id,
  );

  return res.json({result});
});

router.get("/randomQuote", async (req: Request, res: Response, next: NextFunction) => {    
    const result = await UserModel.getUserRandomQuote();
  
    return res.json({result});
  });

router.get("/posts", async (req: Request, res: Response, next: NextFunction) => {    
    const result = await UserModel.getUsersWithPosts();
  
    return res.json({result});
  });

export default router;
