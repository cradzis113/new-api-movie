const dataMovie = require('../models/dataMovie')

async function checkDatasExistence() {
    try {
        const records = await dataMovie.find();

        if (records.length === 0) {
            return true;
        }
        
    } catch (error) {
        console.error('Lỗi khi kiểm tra bản ghi trong schema:', error);
        return false;
    }
}

module.exports = checkDatasExistence
