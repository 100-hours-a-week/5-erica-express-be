const express = require('express')
const {
	getPosts,
	getPost,
	getPostImage,
	getUpdatePost,
	addPost,
	updatePost,
	deletePost,
	checkPostOwner,
	getMyPosts,
	getOtherPosts,
	getCodingPosts
} = require('../controller/post-controller.cjs')
const { getAuthUser, getPostUser } = require('../middleware/authUser.cjs')

const router = express.Router()

//게시물 목록 불러오기 --OK
router.get('/', getAuthUser, getPosts)

//내 게시물
router.get('/myPosts', getAuthUser, getMyPosts)

//고민 게시물
router.get('/other', getAuthUser, getOtherPosts)

//개발 게시물
router.get('/coding', getAuthUser, getCodingPosts)

//게시물 상세 불러오기 --OK
router.get('/:id', getAuthUser, getPost)

//게시물 작성 --OK
router.post('/', getAuthUser, addPost)

//게시물 수정 --OK
router.patch('/:id', getPostUser, updatePost)

//게시물 삭제
router.delete('/:id', getPostUser, deletePost)

//게시물 작성자 비교
router.post('/checkOwner', checkPostOwner)

//게시물 수정시 내용 불러오기
router.get('/:id/update', getPostUser, getUpdatePost)

module.exports = router
