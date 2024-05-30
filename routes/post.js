import express from "express";
import { postController } from "../controller/post-controller.js";

const router = express.Router();

//게시물 목록 불러오기 --OK
router.get("/", postController.getPostList);

//게시물 상세 불러오기 --OK
router.get("/:id", postController.getOnePost);

//게시물 작성 --OK
router.post("/", postController.postPost);

//게시물 수정 --OK
router.patch("/:id", postController.patchPost);

//게시물 삭제
router.delete("/:id", postController.deletePost);

//게시물 작성자 비교
router.post("/checkOwner", postController.isOwner);

export default router;
