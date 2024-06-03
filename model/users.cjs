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
	const result = await queryPromise(getUserQuery(userId))
	return result.length !== 0
}

const checkUserModel = async userId => {
	const result = await queryPromise(getUserQuery(userId))
	return result.length !== 0 ? result[0] : null
}

const checkUserNicknameModel = async nickname => {
	const result = await queryPromise(nicknameQuery(nickname))
	return result.length !== 0
}

const checkUserEmailModel = async email => {
	const result = await queryPromise(emailQuery(email))
	return result.length !== 0
}

//유저 등록 로직
const addUserModel = async data => {
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(data.password, salt)
	const addData = { email: data.email, nickname: data.nickname, password: hash, profile_image: data.profile_image }
	const result = await queryPromise(addUserQuery(addData))
	return result.insertId
}

const checkLogInModel = async email => {
	const result = await queryPromise(emailQuery(email))
	return result.length !== 0 ? result[0] : null
}

//유저 로그인 로직 -> 유저 아이디 반환
const logInUserModel = async (email, password) => {
	const user = await checkLogInModel(email)
	if (!user) return false

	const passwordCorrect = await bcrypt.compare(password, user.password)
	return passwordCorrect ? user : false
}

//유저 정보 수정 로직
const updateUserProfileModel = async data => {
	if (!data.nickname && !data.profile_image) return null
	await queryPromise(updateUserProfileQuery(data))
	return true
}

//유저 비밀번호 수정 로직
const updateUserPasswordModel = async data => {
	const { userId, password } = data
	if (!userId || !password) return false

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)
	const updateData = { password: hash, userId }

	await queryPromise(updateUserPasswordQuery(updateData))
	return true
}

//유저 회원탈퇴 로직
const deleteUserModel = async id => {
	if (!id) return false

	const userExists = await checkUserIdModel(id)
	if (!userExists) return false

	await queryPromise(deleteUserQuery(id))
	return true
}

//게시글 수, 댓글 수 가져오기
const getUserWriteCount = async userId => {
	const postCountResult = await queryPromise(getPostCountQuery(userId))
	const commentCountResult = await queryPromise(getCommentCountQuery(userId))

	return {
		postCount: postCountResult[0]?.count || 0,
		commentCount: commentCountResult[0]?.count || 0
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
