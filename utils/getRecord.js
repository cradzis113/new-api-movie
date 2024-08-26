const DataMovie = require('../models/dataMovie')

async function getRecord(keyword, id) {
    try {
        let records

        if (keyword) {
            records = await DataMovie.find({ title: new RegExp('^' + keyword + '$', 'i') });
        } else if (id) {
            records = await DataMovie.find({_id: id});
        } else {
            records = await DataMovie.find({});
        }

        return records;
    } catch (error) {
        console.error(error);
    }
}

module.exports = getRecord;
