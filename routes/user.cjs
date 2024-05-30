const express = require('express')
const {
	getUsers,
	getUser,
	addUser,
	logInUser,
	updateUserProfile,
	duplicateSignUpNickname,
	updateUserpassword,
	deleteUser,
	duplicateEmail,
	duplicateNickname,
	logOut,
	checkLogIn,
	getMyCount
} = require('../controller/user-controller.cjs')
const { getAuthUser, modifyAuthUser } = require('../middleware/authUser.cjs')
const { validation } = require('../middleware/validation.cjs')

const router = express.Router()

//전체 유저 목록
// router.get('/', getAuthUser, getUsers)

//userId 회원 조회
router.get('/user', getAuthUser, getUser)

//회원가입
router.post('/signup', validation, addUser)

//로그인 확인
router.get('/login', checkLogIn)

//로그인
router.post('/login', logInUser)

//회원정보 변경
router.patch('/user/profile', modifyAuthUser, updateUserProfile)

//비밀번호 변경
router.patch('/user/password', modifyAuthUser, updateUserpassword)

//유저 삭제
router.delete('/user', getAuthUser, deleteUser)

//이메일 중복 체크
router.post('/email/:email', duplicateEmail)

//닉네임 중복 체크
router.post('/nickname/:nickname', getAuthUser, duplicateNickname)

//회원가입시 중복 체크
router.post('/signup/nickname/:nickname', duplicateSignUpNickname)

//로그아웃
router.delete('/logOut', getAuthUser, logOut)

//내가 쓴 글, 댓글 수
router.get('/myWrite', getAuthUser, getMyCount)

//이미지 업로드
// router.post("/upload", userController.postImage);

//TODO: 로그인 상태 확인

module.exports = router
