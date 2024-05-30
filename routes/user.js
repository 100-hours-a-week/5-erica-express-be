import express from "express";
import { userController } from "../controller/user-controller.js";

const router = express.Router();

//전체 유저 목록
router.get("/", userController.getUserList);

//userId 회원 조회
router.get("/:userId", userController.getUser);

//회원가입
router.post("/signup", userController.postUser);

//로그인
router.post("/login", userController.postLongIn);

//회원정보 변경
router.patch("/:userId", userController.patchUserInfo);

//비밀번호 변경
router.patch("/:userId/password", userController.patchUserPassword);

//유저 삭제
router.delete("/:id", userController.deleteUser);

//T이메일 중복 체크
router.post("/email/:email", userController.duplicateEmail);

//닉네임 중복 체크
router.post("/nickname/:nickname", userController.duplicateNickname);

//이미지 업로드
router.post("/upload", userController.postImage);

//TODO: 로그인 상태 확인

export default router;
