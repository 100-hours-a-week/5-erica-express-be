import path from "path";
import express from "express";
const router = express.Router();

const __dirname = path.resolve();
router.get("/:imageUrl", (req, res) => {
  const imageUrl = req.params.imageUrl;
  const filePath = path.join(__dirname, `images/post/${imageUrl}`);
  res.sendFile(filePath);
});

export default router;
