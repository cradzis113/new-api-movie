const DataMovie = require('../models/dataMovie')

async function updateRating(productId, newRating) {
    try {
        const product = await DataMovie.findById(productId);

        if (!product) return;
        
        product.score += newRating;
        product.totalRating += 1;

        await product.save();

        console.log("Đã cập nhật điểm đánh giá trung bình thành công.");
    } catch (error) {
        console.error("Lỗi khi cập nhật điểm đánh giá trung bình:", error);
    }
}

module.exports = updateRating