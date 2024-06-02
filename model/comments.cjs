const {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
} = require('../queries/comments.cjs')

const mysql = require('mysql2')
const { db_info } = require('../config/mysql.cjs')
const { queryPromise } = require('../tools/queryUtils.cjs')

const { upCommentCountQuery, downCommentCountQuery } = require('../queries/posts.cjs')

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
	const connection = mysql.createConnection(db_info)

	try {
		await new Promise((resolve, reject) => {
			connection.beginTransaction(async () => {
				try {
					// 댓글 추가
					await queryPromise(addCommentQuery(data), connection)
					// 게시물의 댓글 수 업데이트
					await queryPromise(upCommentCountQuery(data.postId), connection)

					// 트랜잭션 커밋
					connection.commit()
					resolve(true)
				} catch (error) {
					connection.rollback()
					reject(error)
				}
			})
		})
	} finally {
		connection.end()
	}
}

const updateCommentModel = async data => {
	await queryPromise(updateCommentQuery(data))
	return true
}

const deleteCommentModel = async (postId, commentId) => {
	const connection = mysql.createConnection(db_info)

	try {
		await new Promise((resolve, reject) => {
			connection.beginTransaction(async () => {
				try {
					// 댓글 삭제
					await queryPromise(deleteCommentQuery(commentId), connection)
					// 게시물의 댓글 수 업데이트
					await queryPromise(downCommentCountQuery(postId), connection)

					// 트랜잭션 커밋
					connection.commit()
					resolve(true)
				} catch (error) {
					connection.rollback()
					reject(error)
				}
			})
		})
		return true
	} finally {
		connection.end()
	}
}

module.exports = {
	getCommentModel,
	getCommentsModel,
	checkCommentOwnerModel,
	addCommentModel,
	updateCommentModel,
	deleteCommentModel
}
