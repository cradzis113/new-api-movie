const getRecord = require('../../utils/getRecord')

async function findMovieController(req, res) {
    const title = req.body.title

    if (!title) return res.status(400).json({ message: 'Missing title' });
    
    try {
        oldTitle = title.replaceAll('-', ' ')
        const recordData = await getRecord(oldTitle)
        res.send(recordData)
    } catch (error) {
        console.log(error)
    }
}

module.exports = findMovieController