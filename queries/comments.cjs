const getCommentsQuery = id => {
	return {
		sql: `SELECT 
        comments.*, 
        users.nickname, 
        users.profile_image 
      FROM 
        comments 
      INNER JOIN 
        users 
      ON 
        comments.user_id = users.user_id 
      INNER JOIN 
        posts 
      ON 
        comments.post_id = posts.post_id 
      WHERE 
        posts.post_id = ?
      ORDER BY 
        comments.created_at DESC;`,
		values: [id]
	}
}

const getCommentQuery = id => {
	return {
		sql: `SELECT * 
      FROM comments 
      WHERE 
        comment_id = ?;`,
		values: [id]
	}
}

const addCommentQuery = data => {
	return {
		sql: `INSERT INTO comments (
        comment,
        post_id,
        user_id,
        created_at
      ) VALUES (
        ?, ?, ?, NOW()
      );`,
		values: [data.comment, data.postId, data.userId]
	}
}

const updateCommentQuery = data => {
	return {
		sql: `UPDATE comments 
      SET 
        comment = ?,
        updated_at = NOW() 
      WHERE 
        comment_id = ?;`,
		values: [data.commentContent, data.commentId]
	}
}

const deleteCommentQuery = id => {
	return {
		sql: `DELETE FROM comments 
      WHERE 
        comment_id = ?;`,
		values: [id]
	}
}

module.exports = {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
}
