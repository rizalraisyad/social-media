import { NextFunction, Request, Response } from "express";
import PostModel from "../db/models/post";
import UserPostModel from "../db/models/user_post";
import express from "express";
import {
  validateDirectionParams,
  validateSortByParams,
} from "../function/get-post-query-validator";

const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


interface MulterRequest extends Request {
  file: any;
  image: any;
}

const generateFileName = (_req: Request, file: Express.Multer.File, callback: (error: null, filename: string) => void) => {
  const ext = path.extname(file.originalname);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
  callback(null, fileName);
};

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: (arg0: null, arg1: any) => void) => {
    cb(null, path.join(__dirname, "../../assets"));
  },
  filename: generateFileName
});

const upload = multer({
  storage: storage,
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */

router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!(req as MulterRequest).file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  const imagePath = `assets/${(req as MulterRequest).file.filename}`;
  return res.json({ imagePath });

});


router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401).json({ error: "unauthorized" });
    }

    const { text, tags, imageUrl } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ error: "Must provide text for the new post" });
    }

    const posts = await PostModel.insertPost(
      tags,
      text,
      imageUrl,
      req.user?.id
    );
  
    return res.json({ posts });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  let { user } = req;
  let { authorIds, sortBy, direction } = req.query;

  if (!user) return res.status(401).json({ error: "unauthorized" });
  if (!authorIds || typeof authorIds !== "string")
    return res.status(400).json({ error: "Invalid authorIds parameter" });

  const authorIdsParams = authorIds.split(",").map(Number);
  const sortParam = validateSortByParams(sortBy as string);
  const directionParam = validateDirectionParams(direction as string);

  const posts = await PostModel.getPostsByUserIds(
    authorIdsParams,
    sortParam,
    directionParam
  );

  return res.json({ posts });
});

router.patch("/:updateId", async (req: Request, res: Response, next: NextFunction) => {
  const { text, tags, imageUrl } = req.body;
  const { updateId } = req.params;

  const result = await PostModel.updatePost(Number(updateId), text, tags, imageUrl);

  return res.json({result});
});

router.delete("/:deleteId", async (req: Request, res: Response, next: NextFunction) => {    
  const { deleteId } = req.params;

  const result = await PostModel.deletePost(Number(deleteId));

  return res.json({result});
});

export default router;
