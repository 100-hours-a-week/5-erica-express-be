const { checkPostOwnerModel } = require('../model/posts.cjs')
const { checkCommentOwnerModel } = require('../model/comments.cjs')

const getAuthUser = (req, res, next) => {
	if (req.session && req.session.user) {
		req.user = req.session.user
		next()
	} else {
		return res.status(401).json({ status: 401, message: 'unauthorized', data: null })
	}
}

const modifyAuthUser = (req, res, next) => {
	if (!req.session.user.user_id || !req.session.user) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}
	req.user_id = req.session.user.user_id
	next()
}

//게시물 작성자가 본인이 맞는지 확인
const getPostUser = async (req, res, next) => {
	if (!req.params.id) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	if (!req.session || !req.session.user) {
		return res.status(403).json({ status: 401, message: 'unauthenticated', data: null })
	}

	const check = await checkPostOwnerModel({ userId: req.session.user.user_id, postId: req.params.id })

	if (!check) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}
	next()
}

//댓글 작성자가 본인이 맞는지 확인
const getCommentUser = async (req, res, next) => {
	const postId = Number(req.params.postId)
	const commentId = Number(req.params.commentId)
	console.log(commentId)
	if (!req.session || !req.session.user) {
		return res.status(401).json({ status: 401, message: 'unauthenticated', data: null })
	}
	const userId = req.session.user.user_id

	if (!postId) return res.status(400).json({ status: 400, message: 'invalid_post_id', data: null })

	if (!commentId) return res.status(400).json({ status: 400, message: 'invalid_comment_id', data: null })

	const comment = await checkCommentOwnerModel({ commentId, userId })
	if (comment === -1) return res.status(500).json({ status: 500, message: 'internal_sever_error', data: null })
	if (!comment) {
		return res.status(403).json({ status: 403, message: 'unauthorized', data: null })
	}

	next()
}

module.exports = {
	getAuthUser,
	modifyAuthUser,
	getPostUser,
	getCommentUser
}
