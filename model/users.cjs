const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const { queryPromise } = require('../tools/queryUtils.cjs')

const {
	getUserQuery,
	nicknameQuery,
	emailQuery,
	addUserQuery,
	updateUserPasswordQuery,
	updateUserProfileQuery,
	deleteUserQuery,
	getPostCountQuery,
	getCommentCountQuery
} = require('../queries/users.cjs')

//userId 유효성 조회 로직
const checkUserIdModel = async userId => {
	try {
		const query = getUserQuery(userId)
		const result = await queryPromise(query.sql, query.values)
		return result.length !== 0
	} catch (error) {
		console.log(error)
		return -1
	}
}

const checkUserModel = async userId => {
	try {
		const query = getUserQuery(userId)
		const result = await queryPromise(query.sql, query.values)
		return result.length !== 0 ? result[0] : null
	} catch (error) {
		console.log(error)
		return -1
	}
}

const checkUserNicknameModel = async nickname => {
	try {
		const query = nicknameQuery(nickname)
		const result = await queryPromise(query.sql, query.values)
		return result.length !== 0
	} catch (error) {
		console.log(error)
		return -1
	}
}

const checkUserEmailModel = async email => {
	try {
		const query = emailQuery(email)
		const result = await queryPromise(query.sql, query.values)
		return result.length !== 0
	} catch (error) {
		console.log(error)
		return -1
	}
}

//유저 등록 로직
const addUserModel = async data => {
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(data.password, salt)
	const addData = { email: data.email, nickname: data.nickname, password: hash, profile_image: data.profile_image }
	try {
		const query = addUserQuery(addData)
		const result = await queryPromise(query.sql, query.values)
		return result.insertId
	} catch (error) {
		return -1
	}
}

const checkLogInModel = async email => {
	const query = emailQuery(email)
	try {
		const result = await queryPromise(query.sql, query.values)
		return result.length !== 0 ? result[0] : null
	} catch (error) {
		console.log(error)
		return -1
	}
}

//유저 로그인 로직 -> 유저 아이디 반환
const logInUserModel = async (email, password) => {
	try {
		const user = await checkLogInModel(email)
		if (!user) return false
		if (user === -1) return -1
		const passwordCorrect = await bcrypt.compare(password, user.password)
		return passwordCorrect ? user : false
	} catch (error) {
		console.log(error)
		return -1
	}
}

//유저 정보 수정 로직
const updateUserProfileModel = async data => {
	if (!data.nickname && !data.profile_image) return null
	try {
		const query = updateUserProfileQuery(data)
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

//유저 비밀번호 수정 로직
const updateUserPasswordModel = async data => {
	const { userId, password } = data
	if (!userId || !password) return false

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)
	const updateData = { password: hash, userId }
	const query = updateUserPasswordQuery(updateData)

	try {
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

//유저 회원탈퇴 로직
const deleteUserModel = async id => {
	if (!id) return false

	const userExists = await checkUserIdModel(id)
	if (!userExists) return false
	if (userExists === -1) return -1

	const query = deleteUserQuery(id)

	try {
		await queryPromise(query.sql, query.values)
		return true
	} catch (error) {
		console.log(error)
		return -1
	}
}

//게시글 수, 댓글 수 가져오기
const getUserWriteCount = async userId => {
	try {
		const postQuery = getPostCountQuery(userId)
		const commentQuery = getCommentCountQuery(userId)
		const postCountResult = await queryPromise(postQuery.sql, postQuery.values)
		const commentCountResult = await queryPromise(commentQuery.sql, commentQuery.values)
		return {
			postCount: postCountResult[0]?.count || 0,
			commentCount: commentCountResult[0]?.count || 0
		}
	} catch (error) {
		console.log(error)
		return -1
	}
}

//이미지 저장
const addUserImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
	if (!matches || matches.length !== 3) return null

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `profile_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '../images/profile', imageName)
	fs.writeFile(imagePath, imageBuffer, err => {
		if (err) {
			console.error('Error saving image:', err)
		} else {
			console.log('Image saved successfully')
		}
	})

	const imageUrl = `http://localhost:8000/images/profile/${imageName}`
	return imageUrl
}

module.exports = {
	checkUserIdModel,
	checkUserModel,
	checkUserNicknameModel,
	checkUserEmailModel,
	addUserModel,
	logInUserModel,
	updateUserProfileModel,
	updateUserPasswordModel,
	deleteUserModel,
	addUserImageModel,
	getUserWriteCount
}
