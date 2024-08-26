const deletedRecord = require('../../utils/deleteRecord');
const deleteChildRecord = require('../../utils/deleteChildRecord');
const getRecord = require('../../utils/getRecord');
const updateRecord = require('../../utils/updateRecord');
const { deleteImage, deleteVideo, deleteCharacter } = require('../../utils/deleteService');

async function deleteVideoController(req, res) {
    const data = req.body;

    try {
        if (data) {
            if (Array.isArray(data)) {
                const deletePromises = data.map(item => {
                    const childVideoPromises = item.childVideoName ? item.childVideoName.map(deleteVideo) : [];
                    
                    // Ensure character is an object
                    const characters = typeof item.character === 'string' ? JSON.parse(item.character) : item.character;
                    const characterPromises = characters ? characters.map(char => deleteCharacter(char.fileName)) : [];
                    
                    return Promise.all([
                        ...childVideoPromises,
                        ...characterPromises,
                        deletedRecord(item.id),
                        deleteImage(item.imageName),
                        deleteVideo(item.videoName)
                    ]);
                });

                await Promise.all(deletePromises);
                res.status(200).json({ message: 'Videos deleted successfully.' });
            } else if (typeof data === 'object') {
                const imagePromises = data.deleteMainRecord ? [deleteImage(data.imageName)] : [];
                
                // Ensure character is an object
                const characters = typeof data.character === 'string' ? JSON.parse(data.character) : data.character;
                const characterPromises = characters && data.deleteMainRecord ? characters.map(char => deleteCharacter(char.fileName)) : [];
                
                const childVideoPromises = data.childVideoInfo ? data.childVideoInfo.map(item => deleteVideo(item.nameChildVideo)) : [deleteVideo(data.videoName)];
                const childRecordPromises = data.deleteMainRecord ? [deletedRecord(data.id)] : data.childVideoInfo.map(item => deleteChildRecord(data.id, item.idChildVideo));

                await Promise.all([
                    ...childRecordPromises,
                    ...childVideoPromises,
                    ...characterPromises,
                    ...imagePromises
                ]);

                if (!data.deleteMainRecord) {
                    const [record] = await getRecord(null, data.id);
                    record.videoInfo.childVideoInfo.forEach((episode, index) => {
                        episode.episode = `Episode ${index + 1}`;
                    });
                    await updateRecord(data.id, record);
                }

                res.status(200).json({ message: 'Videos deleted successfully.' });
            }
        } else {
            res.status(400).json({ error: 'No data provided.' });
        }
    } catch (error) {
        console.error('Error deleting video(s):', error);
        res.status(500).json({ error: 'An error occurred while deleting video(s).' });
    }
}

module.exports = deleteVideoController;
