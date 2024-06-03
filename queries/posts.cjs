const postsQuery = () => {
	return {
		sql: `SELECT 
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
        posts.created_at DESC;`,
		values: []
	}
}

// 특정 id 게시물 조회 쿼리
const postQuery = id => {
	return {
		sql: `SELECT 
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
        posts.post_id = ?;`,
		values: [id]
	}
}

// 특정 id 게시물 조회수 설정 쿼리
const updatePostViewQuery = id => {
	return {
		sql: `UPDATE 
        posts 
      SET 
        view = view + 1 
      WHERE 
        posts.post_id = ?;`,
		values: [id]
	}
}

// 본인이 작성한 게시물 조회 쿼리
const myPostsQuery = userId => {
	return {
		sql: `SELECT 
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
        users.user_id = ?
      ORDER BY 
        posts.created_at DESC;`,
		values: [userId]
	}
}

// 고민 게시물 조회 쿼리
const otherPostsQuery = () => {
	return {
		sql: `SELECT 
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
        posts.created_at DESC;`,
		values: []
	}
}

// 개발 게시물 조회 쿼리
const codingPostsQuery = () => {
	return {
		sql: `SELECT 
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
        posts.created_at DESC;`,
		values: []
	}
}

// 게시물 작성 쿼리
const addPostQuery = data => {
	return {
		sql: `INSERT INTO posts (
        user_id, 
        post_image, 
        title, 
        content, 
        created_at, 
        type
      ) VALUES (
        ?, ?, ?, ?, NOW(), ?
      );`,
		values: [data.userId, data.postImage, data.title, data.content, data.type]
	}
}

// 게시물 수정 쿼리
const updatePostQuery = data => {
	return {
		sql: `UPDATE posts 
      SET 
        title = ?, 
        content = ?, 
        post_image = ?, 
        type = ?,
        updated_at = NOW()
      WHERE 
        posts.post_id = ?;`,
		values: [data.title, data.content, data.postImage, data.type, data.id]
	}
}

// 게시물 삭제 쿼리
const deletePostQuery = id => {
	return {
		sql: `DELETE FROM posts 
      WHERE post_id = ?;`,
		values: [id]
	}
}

const getTopPostQuery = () => {
	return {
		sql: `SELECT post_id, title
      FROM posts
      ORDER BY view DESC
      LIMIT 10;`,
		values: []
	}
}

const upCommentCountQuery = postId => {
	return {
		sql: `UPDATE posts
      SET comment_count = comment_count + 1
      WHERE post_id = ?
      FOR UPDATE;`,
		values: [postId]
	}
}

const downCommentCountQuery = postId => {
	return {
		sql: `UPDATE posts
      SET comment_count = comment_count - 1
      WHERE post_id = ?
      FOR UPDATE;`,
		values: [postId]
	}
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
