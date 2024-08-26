const AWS = require('aws-sdk');

async function uploadVideo(outputDirectoryName) {
    const s3 = new AWS.S3();
    const fs = require('fs').promises
    const path = require('path');
    const mime = require('mime-types');

    try {
        const files = await fs.readdir(path.resolve(__dirname, '..', 'video', outputDirectoryName));
        const uploadResults = [];

        for (const file of files) {
            const filePath = path.resolve(__dirname, '..', 'video', outputDirectoryName, file);
            const fileContent = await fs.readFile(filePath);

            const objectKey = `${outputDirectoryName}/${file}`;
            const isTSFile = path.extname(file) === '.mp4';
            const acl = isTSFile ? 'private' : 'public-read';
            const contentType = mime.lookup(filePath);

            const data = await s3.upload({
                Bucket: process.env.VIDEO_BUCKET,
                Key: objectKey,
                Body: fileContent,
                ACL: acl,
                ContentType: contentType,
                StorageClass: 'COLD'
            }).promise();

            uploadResults.push(data);
        }

        return uploadResults;
    } catch (err) {
        throw err;
    }
}

async function uploadImage(imageFile) {
    const s3 = new AWS.S3();
    const fs = require('fs');
    const fileStream = fs.createReadStream(imageFile.path);

    const uploadParams = {
        Bucket: process.env.IMAGE_BUCKET,
        Key: imageFile.filename,
        Body: fileStream,
        ContentType: imageFile.mimetype,
        ACL: 'public-read',
        StorageClass: 'COLD'
    };

    try {
        const data = await s3.upload(uploadParams).promise();
        return data;
    } catch (error) {
        throw error;
    }
}

async function uploadCharacter(characterFile) {
    const s3 = new AWS.S3();
    const fs = require('fs');
    const fileStream = fs.createReadStream(characterFile.path);

    const uploadParams = {
        Bucket: process.env.CHARACTER_BUCKET,
        Key: characterFile.filename,
        Body: fileStream,
        ContentType: characterFile.mimetype,
        ACL: 'public-read',
        StorageClass: 'COLD'
    };

    try {
        const data = await s3.upload(uploadParams).promise();
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = { uploadVideo, uploadImage, uploadCharacter }