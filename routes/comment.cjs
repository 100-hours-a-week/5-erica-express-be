const express = require('express')
const {
	getComments,
	addComment,
	updateComment,
	deleteComment,
	checkCommentOwner
} = require('../controller/comment-controller.cjs')
const { getCommentUser, getAuthUser } = require('../middleware/authUser.cjs')

const router = express.Router()

//해당 게시물 댓글 불러오기
router.get('/:postId/comments', getAuthUser, getComments)

//댓글 작성
router.post('/:postId/comments', getAuthUser, addComment)

//댓글 수정
router.patch('/:postId/comments/:commentId', getCommentUser, updateComment)

//댓글 삭제
router.delete('/:postId/comments/:commentId', getCommentUser, deleteComment)

//댓글 작성자 확인
router.post('/:postId/comments/checkOwner', checkCommentOwner)

module.exports = router
