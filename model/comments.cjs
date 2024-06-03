const {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
} = require('../queries/comments.cjs')

const { db_info } = require('../config/config.cjs')
const mysql = require('mysql2/promise') // promise 기반 mysql2 사용
const { queryPromise } = require('../tools/queryUtils.cjs')

const { upCommentCountQuery, downCommentCountQuery } = require('../queries/posts.cjs')

const getCommentModel = async commentId => {
	const query = getCommentQuery(commentId)
	try {
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		return -1
	}
}

const getCommentsModel = async postId => {
	try {
		const query = getCommentsQuery(postId)
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const checkCommentOwnerModel = async data => {
	try {
		const comment = await getCommentModel(data.commentId)
		if (comment === -1) return -1
		return comment[0].user_id === data.userId
	} catch (error) {
		console.log(error)
		return -1
	}
}

const addCommentModel = async data => {
	const connection = await mysql.createConnection(db_info)

	try {
		await connection.beginTransaction()
		try {
			// 트랜잭션 잠금
			await queryPromise('SELECT * FROM posts WHERE postId = ? FOR UPDATE', [data.postId], connection)
			// 트랜잭션 격리 수준 설정
			await queryPromise('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ', [], connection)
			// 댓글 추가
			const query = addCommentQuery(data)
			await queryPromise(query.sql, query.values, connection)
			// 게시물의 댓글 수 업데이트
			await queryPromise(upCommentCountQuery, [data.postId], connection)

			// 트랜잭션 커밋
			await connection.commit()
			return true
		} catch (error) {
			await connection.rollback()
			return -1
		}
	} finally {
		await connection.end()
	}
}

const updateCommentModel = async data => {
	try {
		const query = updateCommentQuery(data)
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

const deleteCommentModel = async (postId, commentId) => {
	const connection = await mysql.createConnection(db_info)

	try {
		await queryPromise('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ', [], connection)
		await connection.beginTransaction()
		// 트랜잭션 잠금
		await queryPromise('SELECT * FROM posts WHERE postId = ? FOR UPDATE', [postId], connection)
		// 트랜잭션 격리 수준 설정
		// 댓글 삭제
		const query = deleteCommentQuery(commentId)
		await queryPromise(query.sql, query.values, connection)
		// 게시물의 댓글 수 업데이트
		await queryPromise(downCommentCountQuery, [postId], connection)

		// 트랜잭션 커밋
		await connection.commit()
		return true
	} catch (error) {
		await connection.rollback()
		return false
	} finally {
		await connection.end()
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
