const DataMovie = require('../models/dataMovie')

async function updateRecord(id, updatedData) {
    try {
        const user = await DataMovie.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!user) {
            console.log('User not found');
            return;
        }

    } catch (error) {
        console.error('Error updating user:', error);
    }
}

module.exports = updateRecord

