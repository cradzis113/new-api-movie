const express = require('express');
const router = express.Router();

const getDataController = require('../../controllers/user/getDataController')
const findMovieController = require('../../controllers/user/findMovieController')
const updateRatingController = require('../../controllers/user/updateRatingController')
const updateViewController = require('../../controllers/user/updateViewController')

router.get('/getdata', getDataController)
router.post('/movie', findMovieController)
router.post('/rating', updateRatingController)
router.post('/view', updateViewController)
router.post('/cc', (req, res) => {
    console.log(req.get('Referer'))
})

module.exports = router;