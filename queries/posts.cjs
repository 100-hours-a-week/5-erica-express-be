const { getLocalDateTime } = require('../tools/dataUtils.cjs')

// 전체 게시물 조회 쿼리
const postsQuery = () => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    ORDER BY
      posts.created_at DESC;
  `
}

// 특정 id 게시물 조회 쿼리
const postQuery = id => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      posts.postId = ${id}
  `
}

// 특정 id 게시물 조회수 설정 쿼리
const updatePostViewQuery = id => {
	return `UPDATE 
      posts 
    SET 
      view = view + 1 
    WHERE 
      posts.postId = ${id} 
    `
}

// 본인이 작성한 게시물 조회 쿼리
const myPostsQuery = userId => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage ,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      users.userId = ${userId} 
    ORDER BY 
      posts.created_at DESC;
    `
}

// 고민 게시물 조회 쿼리
const otherPostsQuery = () => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId) AS comment_count
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      posts.type = 'other' 
    ORDER BY 
      posts.created_at DESC;
  `
}

// 개발 게시물 조회 쿼리
const codingPostsQuery = () => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profileImage,
      (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.postId) AS comment_count 
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.userId = users.userId 
    WHERE 
      posts.type = 'coding' 
    ORDER BY 
      posts.created_at DESC;
  `
}

// 게시물 작성 쿼리
const addPostQuery = data => {
	const date = getLocalDateTime()
	return `INSERT INTO posts (
      userId, 
      postImage, 
      title, 
      content, 
      created_at, 
      type
    ) VALUES (
      ${data.userId}, 
      '${data.postImage}', 
      '${data.title}', 
      '${data.content}', 
      '${date}', 
      '${data.type}'
    );
  `
}

// 게시물 수정 쿼리
const updatePostQuery = data => {
	const date = getLocalDateTime()

	return `UPDATE posts 
    SET 
      title = "${data.title}", 
      content = "${data.content}", 
      postImage = "${data.postImage}", 
      type = "${data.type}",
      updated_at = "${date}"
    WHERE 
      posts.postId = ${data.id} 
  `
}

// 게시물 삭제 쿼리
const deletePostQuery = id => {
	return `DELETE FROM posts 
    WHERE postId = ${id}; 
  `
}

module.exports = {
	postsQuery,
	postQuery,
	myPostsQuery,
	otherPostsQuery,
	codingPostsQuery,
	addPostQuery,
	updatePostQuery,
	updatePostViewQuery,
	deletePostQuery
}
