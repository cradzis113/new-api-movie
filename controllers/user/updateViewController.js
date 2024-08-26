const updateView = require('../../utils/updateView')

async function updateViewController(req, res) {
    const id = req.body.id

    if (!id) return res.status(400).json({ message: 'Missing  ID' });

    try {
        const view = await updateView(id)
        
        if (!view) {
            return res.status(404).json({ message: 'Document not found or could not update view' });
        }
        
    } catch (error) {
        console.error('Error updating view:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = updateViewController