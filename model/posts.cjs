const path = require('path')
const fs = require('fs')
const {
	postsQuery,
	postQuery,
	myPostsQuery,
	otherPostsQuery,
	codingPostsQuery,
	addPostQuery,
	updatePostQuery,
	updatePostViewQuery,
	deletePostQuery,
	getTopPostQuery
} = require('../queries/posts.cjs')

const { queryPromise } = require('../tools/queryUtils.cjs')

// 게시물 상세 조회 로직
const getPostsModel = async () => {
	try {
		const query = postsQuery()
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const getPostModel = async id => {
	try {
		const query = postQuery(id)
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const updatePostViewModel = async id => {
	try {
		const query = updatePostViewQuery(id)
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

const getMyPostsModel = async userId => {
	try {
		const query = myPostsQuery(userId)
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const getOtherPostsModel = async () => {
	try {
		const query = otherPostsQuery()
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const getCodingPostsModel = async () => {
	try {
		const query = codingPostsQuery()
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const checkPostOwnerModel = async data => {
	try {
		const query = postQuery(data.postId)
		const post = await queryPromise(query.sql, query.values)
		return post[0].user_id === data.userId
	} catch (error) {
		console.log(error)
		return -1
	}
}

const addPostModel = async data => {
	try {
		const query = addPostQuery(data)
		const result = await queryPromise(query.sql, query.values)
		return result.insertId
	} catch (error) {
		console.log(error)
		return -1
	}
}

const updatePostModel = async data => {
	try {
		const query = updatePostQuery(data)
		await queryPromise(query.sql, query.values)
		return data.id
	} catch (error) {
		console.log(error)
		return -1
	}
}

const deletePostModel = async id => {
	try {
		const query = deletePostQuery(id)
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

const getTopPostsModel = async () => {
	try {
		const query = getTopPostQuery()
		return await queryPromise(query.sql, query.values)
	} catch (error) {
		console.log(error)
		return -1
	}
}

const addPostImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

	if (image.includes('localhost')) {
		return image
	}

	if (!matches || matches.length !== 3) {
		console.log('Wrong Image Type')
		return null
	}

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `post_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '../images/post', imageName)
	fs.writeFile(imagePath, imageBuffer, err => {
		if (err) {
			console.error('Error saving image:', err)
			return -1
		} else {
			console.log('Image saved successfully')
		}
	})

	const imageUrl = `http://localhost:8000/images/post/${imageName}`
	return imageUrl
}

module.exports = {
	getPostsModel,
	getPostModel,
	getMyPostsModel,
	getOtherPostsModel,
	getCodingPostsModel,
	checkPostOwnerModel,
	addPostImageModel,
	addPostModel,
	updatePostViewModel,
	updatePostModel,
	deletePostModel,
	getTopPostsModel
}
