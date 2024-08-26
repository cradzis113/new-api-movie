const updateRating = require('../../utils/updateRating');

async function updateRatingController(req, res) {
    const { score, id } = req.body;

    if (!id || !score) {
        return res.status(400).json({ message: 'Missing score or missing ID' });
    }

    try {
        const rating = await updateRating(id, score);

        if (!rating) {
            return res.status(404).json({ message: 'Document not found or could not update rating' });
        }
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = updateRatingController;
