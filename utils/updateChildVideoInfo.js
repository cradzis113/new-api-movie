const DataMovie = require('../models/dataMovie');

async function updateChildVideoInfo(parentId, newUrl) {
    try {
        const parentDoc = await DataMovie.findById(parentId);

        if (!parentDoc) {
            throw new Error('Parent document not found');
        }

        const childVideoInfoArray = parentDoc.videoInfo.childVideoInfo;
        const episodeCount = childVideoInfoArray.length;
        const newEpisodeValue = `Episode ${episodeCount + 1}`;

        childVideoInfoArray.push({ episode: newEpisodeValue, url: newUrl });
        parentDoc.videoInfo.childVideoInfo = childVideoInfoArray;

        const updatedParentDoc = await parentDoc.save();

        return updatedParentDoc;
    } catch (error) {
        console.error('Error updating child video info:', error);
        throw error;
    }
}

module.exports = updateChildVideoInfo;
