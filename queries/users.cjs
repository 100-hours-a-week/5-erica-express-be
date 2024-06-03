const getUserQuery = id => {
	return {
		sql: `SELECT * 
      FROM users 
      WHERE 
        user_id = ?;`,
		values: [id]
	}
}

const nicknameQuery = nickname => {
	return {
		sql: `SELECT * 
      FROM users 
      WHERE 
        nickname = ?;`,
		values: [nickname]
	}
}

const emailQuery = email => {
	return {
		sql: `SELECT * 
      FROM users 
      WHERE 
        email = ?;`,
		values: [email]
	}
}

const addUserQuery = data => {
	return {
		sql: `INSERT INTO users (
        email,
        nickname,
        password,
        profile_image,
        created_at
      ) VALUES (
        ?, ?, ?, ?, NOW()
      );`,
		values: [data.email, data.nickname, data.password, data.profile_image]
	}
}

const updateUserProfileQuery = data => {
	return {
		sql: `UPDATE users
      SET 
        nickname = ?,
        profile_image = ?
      WHERE 
        user_id = ?;`,
		values: [data.nickname, data.profile_image, data.userId]
	}
}

const updateUserPasswordQuery = data => {
	return {
		sql: `UPDATE users
      SET 
        password = ?,
        updated_at = NOW()
      WHERE 
        user_id = ?;`,
		values: [data.password, data.userId]
	}
}

const deleteUserQuery = id => {
	return {
		sql: `DELETE FROM users 
      WHERE 
        user_id = ?;`,
		values: [id]
	}
}

const getPostCountQuery = id => {
	return {
		sql: `SELECT COUNT(*) AS count 
      FROM posts 
      WHERE 
        user_id = ?;`,
		values: [id]
	}
}

const getCommentCountQuery = id => {
	return {
		sql: `SELECT COUNT(*) AS count 
      FROM comments 
      WHERE 
        user_id = ?;`,
		values: [id]
	}
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
