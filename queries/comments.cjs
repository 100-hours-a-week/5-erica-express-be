const { getLocalDateTime } = require('../tools/dataUtils.cjs')

const getCommentsQuery = id => {
	return `SELECT 
      comments.*, 
      users.nickname, 
      users.profileImage 
    FROM 
      comments 
    INNER JOIN 
      users 
    ON 
      comments.userId = users.userId 
    INNER JOIN 
      posts 
    ON 
      comments.postId = posts.postId 
    WHERE 
      posts.postId = ${id}
    ORDER BY 
      comments.created_at DESC;
  `
}

const getCommentQuery = id => {
	return `SELECT * 
    FROM comments 
    WHERE 
      commentId = ${id};  
  `
}

const addCommentQuery = data => {
	const date = getLocalDateTime()

	return `INSERT INTO comments (
      comment,
      postId,
      userId,
      created_at
    ) VALUES (
      '${data.comment}',
      ${data.postId},
      ${data.userId},
      '${date}'
    );
  `
}

const updateCommentQuery = data => {
	return `UPDATE comments 
    SET 
      comment = '${data.commentContent}' 
    WHERE 
      commentId = ${data.commentId};   
  `
}

const deleteCommentQuery = id => {
	return `DELETE FROM comments 
    WHERE 
      commentId = ${id};  
  `
}

module.exports = {
	getCommentQuery,
	getCommentsQuery,
	addCommentQuery,
	updateCommentQuery,
	deleteCommentQuery
}
