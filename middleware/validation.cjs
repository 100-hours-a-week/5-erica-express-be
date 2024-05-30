const { checkUserEmailModel, checkUserNicknameModel } = require('../model/users.cjs')

const validation = async (req, res, next) => {
	const { nickname, email } = req.body

	if (await checkUserEmailModel(email)) {
		return res.status(400).json({ status: 400, message: 'already_exist_email', data: null })
	}

	if (await checkUserNicknameModel(nickname)) {
		return res.status(400).json({ status: 400, message: 'already_exist_nickname', data: null })
	}

	next()
}

module.exports = { validation }
