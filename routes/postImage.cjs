const path = require('path')
const express = require('express')
const router = express.Router()

router.get('/:imageUrl', (req, res) => {
	const imageUrl = req.params.imageUrl
	const filePath = path.join(__dirname, `images/post/${imageUrl}`)
	res.sendFile(filePath)
})

module.exports = router
