const express = require('express');
const router = express.Router();

const handleFileMD = require('../../middleware/handleFileMD')
const addVideoController = require('../../controllers/admin/addVideoController')

const deleteVideoController = require('../../controllers/admin/deleteVideoController')
const updateVideoController = require('../../controllers/admin/updateVideoController')

const addChildVideoController = require('../../controllers/admin/addChildVideoController')

router.post('/delete-video', deleteVideoController)
router.post('/add-video', handleFileMD(), addVideoController)
router.post('/edit-video', handleFileMD(), updateVideoController)
router.post('/add-link-video', handleFileMD(), addChildVideoController)

module.exports = router;