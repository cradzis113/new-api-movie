const DataMovie = require('../models/dataMovie')

async function createData(data) {
    try {
        const newData = new DataMovie(data);

        const savedData = await newData.save();
        return savedData;
    } catch (error) {
        console.error('Lỗi khi tạo và lưu trữ bản ghi mới:', error);
        return null;
    }
}

module.exports = createData