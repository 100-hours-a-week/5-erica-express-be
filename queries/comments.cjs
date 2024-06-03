const getCommentsQuery = id => {
	return `SELECT 
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
      posts.post_id = ${id}
    ORDER BY 
      comments.created_at DESC;
  `
}

const getCommentQuery = id => {
	return `SELECT * 
    FROM comments 
    WHERE 
      comment_id = ${id};  
  `
}

const addCommentQuery = data => {
	return `INSERT INTO comments (
      comment,
      post_id,
      user_id,
      created_at
    ) VALUES (
      '${data.comment}',
      ${data.postId},
      ${data.userId},
      NOW()
    );
  `
}

const updateCommentQuery = data => {
	return `UPDATE comments 
    SET 
      comment = '${data.commentContent}',
      updated_at= NOW() 
    WHERE 
      comment_id = ${data.commentId};   
  `
}

const deleteCommentQuery = id => {
	return `DELETE FROM comments 
    WHERE 
      comment_id = ${id};  
  `
}

module.exports = {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
}
