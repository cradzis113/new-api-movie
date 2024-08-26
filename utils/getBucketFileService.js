const AWS = require('aws-sdk');

async function getBucketFileVideo() {
    const s3 = new AWS.S3();
    const bucketName = process.env.VIDEO_BUCKET;
    const prefix = '';

    try {
        const params = {
            Bucket: bucketName,
            Prefix: prefix,
            Delimiter: '/'
        };

        const data = await s3.listObjectsV2(params).promise();

        const commonPrefixes = data.CommonPrefixes || [];

        async function listObjectsWithExtension(bucket, prefix, ...extensions) {
            const params = {
                Bucket: bucket,
                Prefix: prefix
            };

            try {
                const data = await s3.listObjectsV2(params).promise();
                const filteredObjects = data.Contents.filter(obj => extensions.some(ext => obj.Key.endsWith(ext)));
                return filteredObjects;
            } catch (error) {
                console.error('Error listing objects:', error);
                throw error;
            }
        }

        const listAllPrefixes = () => commonPrefixes.map(commonPrefix => commonPrefix.Prefix);

        const getETags = async (bucket, objects) => {
            const etags = [];

            for (const obj of objects) {
                const params = {
                    Bucket: bucket,
                    Key: obj.Key
                };

                try {
                    const headObjectOutput = await s3.headObject(params).promise();
                    const etag = headObjectOutput.ETag || 'ETagNotAvailable';

                    etags.push({
                        key: obj.Key,
                        etag: etag
                    });
                } catch (error) {
                    console.error('Error getting ETag:', error);
                }
            }

            const result = etags.reduce((acc, cur) => {
                if (cur.key.endsWith('.m3u8')) {
                    acc.m3u8Key = cur.key;
                    acc.m3u8Etag = cur.etag;
                } else if (cur.key.endsWith('.mp4')) {
                    acc.videoKey = cur.key;
                    acc.videoEtag = cur.etag;
                }
                return acc;
            }, {});

            return result;
        };

        const result = {
            Contents: [],
            keyCount: 0
        };

        const allPrefixes = listAllPrefixes();

        for (const prefix of allPrefixes) {
            const objectsInPrefix = await listObjectsWithExtension(bucketName, prefix, '.mp4', '.m3u8');
            const etagsInPrefix = await getETags(bucketName, objectsInPrefix);
            result.Contents.push(etagsInPrefix);
        }

        result.keyCount = result.Contents.length;
        return result;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function getBucketFileImage() {
    const s3 = new AWS.S3();
    const bucketParams = {
        Bucket: process.env.IMAGE_BUCKET,
        Delimiter: '/',
        Prefix: '',
    };

    try {
        const data = await s3.listObjectsV2(bucketParams).promise();
        return data;
    } catch (error) {
        throw error;
    }
}

async function getBucketFileCharacter() {
    const s3 = new AWS.S3();
    const bucketParams = {
        Bucket: process.env.CHARACTER_BUCKET,
        Delimiter: '/',
        Prefix: '',
    };

    try {
        const data = await s3.listObjectsV2(bucketParams).promise();
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = { getBucketFileVideo, getBucketFileImage, getBucketFileCharacter }
