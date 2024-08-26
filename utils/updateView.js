const DataMovie = require('../models/dataMovie')

async function updateView(productId) {
    try {
        const product = await DataMovie.findById(productId);

        if (!product) return;

        product.view += 1;
        await product.save();
        
        console.log("Đã cập nhật lượt xem thành công.");
    } catch (error) {
        console.error("Lỗi khi cập nhật lượt xem:", error);
    }
}

module.exports = updateView