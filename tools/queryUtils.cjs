const mysql = require('mysql2')
const { db_info } = require('../config/mysql.cjs')

const conn = mysql.createConnection(db_info)

const queryPromise = (query, connection = conn) => {
	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

module.exports = { queryPromise }
