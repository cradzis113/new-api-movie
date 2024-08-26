const getRecord = require('../../utils/getRecord');
const deleteFile = require('../../utils/deleteFile');
const createEtag = require('../../utils/createEtag');
const updateCharacter = require('../../utils/updateCharacter');
const createHlsVideo = require('../../utils/createHlsVideo');
const updateChildVideoInfo = require('../../utils/updateChildVideoInfo');
const { uploadVideo, uploadCharacter } = require('../../utils/uploadService');
const { getBucketFileVideo, getBucketFileCharacter } = require('../../utils/getBucketFileService');

async function addChildVideoController(req, res) {
    let filesToDelete = [];
    try {
        const { id, characterInfo } = req.body;
        const videoFile = req.files?.video?.[0];
        const characterImages = req.files?.characterImage;

        if (!(id && videoFile)) {
            return res.status(400).send(false);
        }

        if (characterImages) {
            characterImages.map(item => filesToDelete.push(item.path))
        }

        filesToDelete.push(videoFile.path);

        const data = await getRecord(null, id);
        if (!data) {
            filesToDelete.forEach(deleteFile);
            return res.status(400).send('Id không hợp lệ!');
        }

        const etag = createEtag(videoFile.path);
        const characterEtags = characterImages ? characterImages.map(item => ({
            path: item.path,
            etag: createEtag(item.path),
            itemName: item.originalname
        })) : [];

        const characBucketFiles = await getBucketFileCharacter();
        const videoBucketFiles = await getBucketFileVideo();

        const videoExists = videoBucketFiles.Contents.some(item => item.videoEtag === etag);

        if (videoExists) {
            filesToDelete.forEach(deleteFile);
            return res.status(400).send('Video tồn tại!');
        }

        const characterExists = characBucketFiles.Contents.filter(characterData =>
            characterEtags.some(character => character.etag === characterData.ETag)
        ).map(characterData => characterData.ETag);

        const uniqueCharacters = characterEtags.filter(character => !characterExists.includes(character.etag));

        let processedCharacters = null;
        if (uniqueCharacters.length > 0 && characterInfo) {
            const parsedCharacterInfo = JSON.parse(characterInfo);
            processedCharacters = await Promise.all(parsedCharacterInfo.map(async (item) => {
                const matchedImage = uniqueCharacters.find(image => item.fileName === image.itemName);
                if (!matchedImage) return null;

                const characterFileFilter = characterImages.find(i => i.originalname === matchedImage.itemName);
                if (characterFileFilter) {
                    const uploadedCharacter = await uploadCharacter(characterFileFilter);
                    return {
                        characterName: item.characterName,
                        realName: item.realName,
                        fileName: characterFileFilter.filename,
                        url: uploadedCharacter.Location
                    };
                }
                return null;
            }));
        }

        const videoName = videoFile.filename.split('.mp4')[0];
        const hlsPath = await createHlsVideo(videoFile.path, videoName);
        filesToDelete.push(hlsPath);

        const uploadedVideo = await uploadVideo(videoName);
        const location = uploadedVideo.find(item => item.key.includes('.m3u8')).Location;

        if (processedCharacters) {
            const processedCharactersFilter = processedCharacters.filter(item => item !== null)
            await Promise.all(processedCharactersFilter.map(async (item) => await updateCharacter(id, item)));
        }

        await updateChildVideoInfo(id, location);
        filesToDelete.forEach(deleteFile);

        res.send('Upload video thành công!');
    } catch (error) {
        filesToDelete.forEach(deleteFile);
        console.error('Error in addChildVideoController:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm video.');
    }
}

module.exports = addChildVideoController;
