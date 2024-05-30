const {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
} = require('../queries/comments.cjs')

const { queryPromise } = require('../tools/queryUtils.cjs')

const getCommentModel = async commentId => {
	return await queryPromise(getCommentQuery(commentId))
}

const getCommentsModel = async postId => {
	return await queryPromise(getCommentsQuery(postId))
}

const checkCommentOwnerModel = async data => {
	const comment = await getCommentModel(data.commentId)
	return comment[0].userId === data.userId
}

const addCommentModel = async data => {
	await queryPromise(addCommentQuery(data))
	return true
}

const updateCommentModel = async data => {
	await queryPromise(updateCommentQuery(data))
	return true
}

const deleteCommentModel = async commentId => {
	await queryPromise(deleteCommentQuery(commentId))
	return true
}

module.exports = {
	getCommentModel,
	getCommentsModel,
	checkCommentOwnerModel,
	addCommentModel,
	updateCommentModel,
	deleteCommentModel
}
