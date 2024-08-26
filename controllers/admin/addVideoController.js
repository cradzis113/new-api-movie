const createHlsVideo = require('../../utils/createHlsVideo');
const deleteFile = require('../../utils/deleteFile');
const createEtag = require('../../utils/createEtag');
const checkDataExistence = require('../../utils/checkDataExistence');
const createRecord = require('../../utils/createRecord');
const getAllFieldValues = require('../../utils/getAllFieldValues')
const { getBucketFileImage, getBucketFileVideo } = require('../../utils/getBucketFileService');
const { uploadVideo, uploadImage, uploadCharacter } = require('../../utils/uploadService');

async function addVideoController(req, res) {
    let { category, title, description, tags } = req.body;
    title = title.trim();
    description = description.trim()

    const videoFile = req.files?.video[0];
    const imageFile = req.files?.image[0];
    const videoName = videoFile.filename.split('.mp4')[0];

    const characterImage = req.files.characterImage ?? null;
    const characterInfo = req.body.characterInfo ?? null;

    let filesToDelete = [videoFile.path, imageFile.path];
    characterImage?.forEach(element => filesToDelete.push(element.path));

    let newData = {};

    if (!(category && title && description && tags && videoFile && imageFile)) {
        return res.send(false);
    }

    try {
        const imageBucketFiles = await getBucketFileImage();
        const videoBucketFiles = await getBucketFileVideo();
        const dataExistence = await checkDataExistence();

        if ((imageBucketFiles.Contents.length && videoBucketFiles.Contents.length) === 0 && dataExistence) {
            const convertedVideoPath = await createHlsVideo(videoFile.path, videoName);
            filesToDelete.push(convertedVideoPath);

            const uploadedVideo = await uploadVideo(videoName);
            const uploadedImage = await uploadImage(imageFile);

            let processedCharacters = [];

            if (characterImage && req.body.characterInfo) {
                const characterInfoParsed = JSON.parse(characterInfo);
                processedCharacters = await Promise.all(characterInfoParsed.map(async (item) => {
                    const matchedImage = characterImage.find(image => item.fileName === image.originalname);
                    if (matchedImage) {
                        const uploadedCharacter = await uploadCharacter(matchedImage);
                        return {
                            characterName: item.characterName,
                            realName: item.realName,
                            fileName: matchedImage.filename,
                            url: uploadedCharacter.Location
                        };
                    }
                }));
                processedCharacters = processedCharacters.filter(character => character); // Lọc các undefined
            }

            newData = {
                imageInfo: {
                    name: uploadedImage.key,
                    url: uploadedImage.Location
                },
                category: category,
                tags: tags,
                videoInfo: {
                    name: uploadedVideo[0].key.split('/')[0],
                    childVideoInfo: [
                        {
                            episode: 'Episode 1',
                            url: uploadedVideo.find(item => item.Location.endsWith('.m3u8'))?.Location
                        }
                    ]
                },
                description: description,
                title: title,
                view: 0,
                score: 0,
                totalRating: 0,
                character: processedCharacters.length ? processedCharacters : null
            };

            await createRecord(newData);
            await Promise.all(filesToDelete.map(item => deleteFile(item)));
            return res.send('Upload video thành công!');
        }

        let messages = [];
        const etags = filesToDelete.map(item => createEtag(item));
        const titleValues = await getAllFieldValues('title');
        const descriptionValues = await getAllFieldValues('description');

        const videoExists = videoBucketFiles.Contents.some(item => etags.includes(item.videoEtag));
        const imageExists = imageBucketFiles.Contents.some(item => etags.includes(item.ETag));

        if (videoExists) {
            messages.push('Video tồn tại');
        }

        if (imageExists) {
            messages.push('Image tồn tại');
        }

        if (titleValues.includes(title)) {
            messages.push('Title tồn tại');
        }

        if (descriptionValues.includes(description)) {
            messages.push('Description tồn tại');
        }

        if (messages.length > 1) {
            await Promise.all(filesToDelete.map(item => deleteFile(item)));
            const formattedMessage = messages.join(' - ') + '!';
            return res.send(formattedMessage);
        } else if (messages.length === 1) {
            await Promise.all(filesToDelete.map(item => deleteFile(item)));
            return res.send(messages[0] + '!');
        }

        // All steps success

        const convertedVideoPath = await createHlsVideo(videoFile.path, videoName);
        filesToDelete.push(convertedVideoPath);

        const uploadedVideo = await uploadVideo(videoName);
        const uploadedImage = await uploadImage(imageFile);

        let processedCharacters = [];

        if (characterImage && req.body.characterInfo) {
            const characterInfoParsed = JSON.parse(characterInfo);
            processedCharacters = await Promise.all(characterInfoParsed.map(async (item) => {
                const matchedImage = characterImage.find(image => item.fileName === image.originalname);
                if (matchedImage) {
                    const uploadedCharacter = await uploadCharacter(matchedImage);
                    return {
                        characterName: item.characterName,
                        realName: item.realName,
                        fileName: matchedImage.filename,
                        url: uploadedCharacter.Location
                    };
                }
            }));
            processedCharacters = processedCharacters.filter(character => character); // Lọc các undefined
        }

        newData = {
            imageInfo: {
                name: uploadedImage.key,
                url: uploadedImage.Location
            },
            category: category,
            tags: tags,
            videoInfo: {
                name: uploadedVideo[0].key.split('/')[0],
                childVideoInfo: [
                    {
                        episode: 'Episode 1',
                        url: uploadedVideo.find(item => item.Location.endsWith('.m3u8'))?.Location
                    }
                ]
            },
            view: 0,
            score: 0,
            totalRating: 0,
            title: title,
            description: description,
            character: processedCharacters.length ? processedCharacters : null
        };

        await createRecord(newData);
        await Promise.all(filesToDelete.map(item => deleteFile(item)));
        return res.send('Upload video thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm video:', error);
        await Promise.all(filesToDelete.map(item => deleteFile(item)));
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = addVideoController;
