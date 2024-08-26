const mongoose = require('mongoose');
const DataMovie = require('../models/dataMovie')
const { ObjectId } = mongoose.Types;

const deleteCharacterRecord = async (docId, childId) => {
    try {
        await DataMovie.updateOne(
            { _id: new ObjectId(docId) },
            { $pull: { "character": { _id: new ObjectId(childId) } } }
        );

        const updatedDocument = await DataMovie.findById(docId);
        if (updatedDocument.character.length === 0) {
            await DataMovie.updateOne(
                { _id: new ObjectId(docId) },
                { $set: { "character": null } }
            );
        }

        console.log('Character deleted successfully');
    } catch (error) {
        console.error('Error deleting character:', error);
    }
};

module.exports = deleteCharacterRecord;
