const AWS = require('aws-sdk');

async function deleteImage(name) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.IMAGE_BUCKET,
        Key: name
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteCharacter(name) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.CHARACTER_BUCKET,
        Key: name
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteVideo(name) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.VIDEO_BUCKET,
        Prefix: name + '/',
    };

    try {
        const data = await s3.listObjects(params).promise();

        if (data.Contents.length === 0) {
            console.log("Không có đối tượng nào được tìm thấy.");
            return;
        }

        const deleteParams = {
            Bucket: process.env.VIDEO_BUCKET,
            Delete: { Objects: [] },
        };

        data.Contents.forEach((content) => {
            deleteParams.Delete.Objects.push({ Key: content.Key });
        });

        await s3.deleteObjects(deleteParams).promise();
        console.log("Đã xóa các đối tượng thành công.");
    } catch (err) {
        console.error("Lỗi khi xóa đối tượng: ", err);
    }
}

module.exports = { deleteImage, deleteVideo, deleteCharacter }