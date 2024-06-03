// 전체 게시물 조회 쿼리
const postsQuery = () => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profile_image
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.user_id = users.user_id 
    ORDER BY
      posts.created_at DESC;
  `
}

// 특정 id 게시물 조회 쿼리
const postQuery = id => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profile_image
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.user_id = users.user_id 
    WHERE 
      posts.post_id = ${id}
  `
}

// 특정 id 게시물 조회수 설정 쿼리
const updatePostViewQuery = id => {
	return `UPDATE 
      posts 
    SET 
      view = view + 1 
    WHERE 
      posts.post_id = ${id} 
    `
}

// 본인이 작성한 게시물 조회 쿼리
const myPostsQuery = userId => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profile_image
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.user_id = users.user_id 
    WHERE 
      users.user_id = ${userId} 
    ORDER BY 
      posts.created_at DESC;
    `
}

// 고민 게시물 조회 쿼리
const otherPostsQuery = () => {
	return `SELECT 
      posts.*, 
      users.nickname, 
      users.profile_image
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.user_id = users.user_id 
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
      users.profile_image
    FROM 
      posts 
    INNER JOIN 
      users 
    ON 
      posts.user_id = users.user_id 
    WHERE 
      posts.type = 'coding' 
    ORDER BY 
      posts.created_at DESC;
  `
}

// 게시물 작성 쿼리
const addPostQuery = data => {
	return `INSERT INTO posts (
    user_id, 
      post_image, 
      title, 
      content, 
      created_at, 
      type
    ) VALUES (
      ${data.userId}, 
      '${data.postImage}', 
      '${data.title}', 
      '${data.content}', 
      NOW(),
      '${data.type}'
    );
  `
}

// 게시물 수정 쿼리
const updatePostQuery = data => {
	return `UPDATE posts 
    SET 
      title = "${data.title}", 
      content = "${data.content}", 
      post_image = "${data.postImage}", 
      type = "${data.type}",
      updated_at = NOW()
    WHERE 
      posts.post_id = ${data.id} 
  `
}

// 게시물 삭제 쿼리
const deletePostQuery = id => {
	return `DELETE FROM posts 
    WHERE post_id = ${id}; 
  `
}

const getTopPostQuery = () => {
	return `SELECT post_id, title
    FROM posts
    ORDER BY view DESC
    LIMIT 10;
  `
}

const upCommentCountQuery = postId => {
	return `UPDATE posts
	SET comment_count = comment_count + 1
	WHERE post_id = ${postId}
  FOR UPDATE;`
}

const downCommentCountQuery = postId => {
	return `UPDATE posts
	SET comment_count = comment_count - 1
	WHERE post_id = ${postId}
  FOR UPDATE;`
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
	deletePostQuery,
	getTopPostQuery,
	upCommentCountQuery,
	downCommentCountQuery
}
