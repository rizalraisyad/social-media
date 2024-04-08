import express from "express";

import posts from "./posts";
import users from "./users";
import auth from "./auth";

const router = express.Router();

router.use("/", auth);

router.use("/posts", posts);
router.use("/users", users);

export default router;
