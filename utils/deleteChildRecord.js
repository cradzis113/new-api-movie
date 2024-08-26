const mongoose = require('mongoose');
const DataMovie = require('../models/dataMovie')
const { ObjectId } = mongoose.Types;

const deleteChildRecord = async (docId, childId) => {
    try {
        await DataMovie.updateOne(
            { _id: new ObjectId(docId) },
            { $pull: { "videoInfo.childVideoInfo": { _id: new ObjectId(childId) } } }
        );
        
        console.log('Character deleted successfully');
    } catch (error) {
        console.error('Error deleting character:', error);
    }
};

module.exports = deleteChildRecord;
