const { getLocalDateTime } = require('../tools/dataUtils.cjs')

const getUserQuery = id => {
	return `SELECT * 
    FROM users 
    WHERE 
      userId = ${id};
  `
}

const nicknameQuery = nickname => {
	return `SELECT * 
    FROM users 
    WHERE 
      nickname = '${nickname}';  
  `
}

const emailQuery = email => {
	return `SELECT * 
    FROM users 
    WHERE 
      email = '${email}';
  `
}

const addUserQuery = data => {
	const date = getLocalDateTime()

	return `INSERT INTO users (
      email,
      nickname,
      password,
      profileImage,
      created_at
    ) VALUES (
      '${data.email}',
      '${data.nickname}',
      '${data.password}',
      '${data.profileImage}',
      '${date}'
    );
  `
}

const updateUserProfileQuery = data => {
	return `UPDATE users
    SET 
      nickname = '${data.nickname}',
      profileImage = '${data.profile_image}'
    WHERE 
      userId = ${data.userId};
  `
}

const updateUserPasswordQuery = data => {
	return `UPDATE users
    SET 
      password = '${data.password}'
    WHERE 
      userId = ${data.userId};
  `
}

const deleteUserQuery = id => {
	return `DELETE FROM users 
    WHERE 
      userId = ${id};
  `
}

const getPostCountQuery = id => {
	return `SELECT COUNT(*) AS count 
    FROM posts 
    WHERE 
      userId = ${id};
  `
}

const getCommentCountQuery = id => {
	return `SELECT COUNT(*) AS count 
    FROM comments 
    WHERE 
      userId = ${id};
  `
}

module.exports = {
	getUserQuery,
	nicknameQuery,
	emailQuery,
	addUserQuery,
	updateUserPasswordQuery,
	updateUserProfileQuery,
	deleteUserQuery,
	getPostCountQuery,
	getCommentCountQuery
}
