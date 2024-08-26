const DataMovie = require('../models/dataMovie')

const deleteRecord = async (id) => {
    try {
        const existingRecord = await DataMovie.findOne({ _id: id });
        if (!existingRecord) {
            console.log('Không tìm thấy bản ghi để xóa.');
            return;
        }

        const deletedRecord = await DataMovie.deleteOne({ _id: id });
        console.log('Bản ghi đã được xóa thành công:', deletedRecord);
    } catch (error) {
        console.error('Lỗi khi xóa bản ghi:', error);
    }
};

module.exports = deleteRecord
