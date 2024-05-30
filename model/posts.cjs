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
	deletePostQuery
} = require('../queries/posts.cjs')

const { queryPromise } = require('../tools/queryUtils.cjs')

//post관련 서비스
//게시물 상세 조회 로직
const getPostsModel = async () => {
	return await queryPromise(postsQuery())
}

const getPostModel = async id => {
	return await queryPromise(postQuery(id))
}

const updatePostViewModel = async id => {
	await queryPromise(updatePostViewQuery(id))
	return true
}

const getMyPostsModel = async userId => {
	return await queryPromise(myPostsQuery(userId))
}

const getOtherPostsModel = async () => {
	return await queryPromise(otherPostsQuery())
}

const getCodingPostsModel = async () => {
	return await queryPromise(codingPostsQuery())
}

const checkPostOwnerModel = async data => {
	const post = await getPostModel(data.postId)
	return post[0].userId === data.userId
}

const addPostModel = async data => {
	const result = await queryPromise(addPostQuery(data))
	return result.insertId
}

const updatePostModel = async data => {
	await queryPromise(updatePostQuery(data))
	return data.id
}

const deletePostModel = async id => {
	await queryPromise(deletePostQuery(id))
	return true
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
	deletePostModel
}
