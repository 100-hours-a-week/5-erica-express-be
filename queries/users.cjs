const getUserQuery = id => {
	return `SELECT * 
    FROM users 
    WHERE 
      user_id = ${id};
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
	return `INSERT INTO users (
      email,
      nickname,
      password,
      profile_image,
      created_at
    ) VALUES (
      '${data.email}',
      '${data.nickname}',
      '${data.password}',
      '${data.profile_image}',
      NOW()
    );
  `
}

const updateUserProfileQuery = data => {
	return `UPDATE users
    SET 
      nickname = '${data.nickname}',
      profile_image = '${data.profile_image}'
    WHERE 
      user_id = ${data.userId};
  `
}

const updateUserPasswordQuery = data => {
	return `UPDATE users
    SET 
      password = '${data.password}',
      updated_at = NOW()
    WHERE 
      user_id = ${data.userId};
  `
}

const deleteUserQuery = id => {
	return `DELETE FROM users 
    WHERE 
      user_id = ${id};
  `
}

const getPostCountQuery = id => {
	return `SELECT COUNT(*) AS count 
    FROM posts 
    WHERE 
      user_id = ${id};
  `
}

const getCommentCountQuery = id => {
	return `SELECT COUNT(*) AS count 
    FROM comments 
    WHERE 
      user_id = ${id};
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
