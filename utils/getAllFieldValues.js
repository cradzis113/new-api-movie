const dataMovie = require('../models/dataMovie');

async function getAllFieldValues(field) {
    try {
        const titleValues = await dataMovie.distinct(field);
        return titleValues;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ schema:', error);
        return [];
    }
}

module.exports = getAllFieldValues;
