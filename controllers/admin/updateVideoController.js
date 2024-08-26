const createEtag = require('../../utils/createEtag');
const deleteFile = require('../../utils/deleteFile');
const updateRecord = require('../../utils/updateRecord');
const updateCharacter = require('../../utils/updateCharacter');
const deleteCharacterRecord = require('../../utils/deleteCharacterRecord');
const { deleteCharacter } = require('../../utils/deleteService');
const { uploadCharacter } = require('../../utils/uploadService');
const { getBucketFileCharacter } = require('../../utils/getBucketFileService');

const updateVideoController = async (req, res) => {
    const data = req.body;
    const characterImages = req.files?.characterImage;

    let filesToDelete = characterImages?.map(item => item.path);
    const { id, episode, childVideoInfo, characterInfo, ...newData } = data;
    
    try {
        const characterEtags = characterImages ? characterImages.map(item => ({
            path: item.path,
            etag: createEtag(item.path),
            itemName: item.originalname
        })) : [];

        const characBucketFiles = await getBucketFileCharacter();
        const characterExists = characBucketFiles.Contents.filter(characterData =>
            characterEtags.some(character => character.etag === characterData.ETag)
        ).map(characterData => characterData.ETag);

        const uniqueCharacters = characterEtags.filter(character => !characterExists.includes(character.etag));

        let processedCharacters = null;
        const parsedCharacterInfo = JSON.parse(characterInfo);
        const noId = parsedCharacterInfo.some(Element => !Element.hasOwnProperty('id'));

        if (uniqueCharacters.length > 0 && characterInfo && noId) {
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

        if (episode && episode.length === childVideoInfo.length) {
            const episodeDefault = childVideoInfo.find(item => item.episode === 'Episode 1');
            const remainingEpisodes = childVideoInfo.filter(ep => ep.episode !== 'Episode 1');
            const reorderedEpisodes = episode.map(episodeName => remainingEpisodes.find(episode => episode.episode === episodeName));
            reorderedEpisodes.unshift(episodeDefault);

            reorderedEpisodes.forEach((item, index) => {
                item.episode = `Episode ${index + 1}`;
            });

            if (processedCharacters) {
                const processedCharactersFilter = processedCharacters.filter(item => item !== null);
                await updateCharacter(id, processedCharactersFilter);
            } else {
                await Promise.all(parsedCharacterInfo.map(async (item) => {
                    await deleteCharacterRecord(id, item.id);
                    await deleteCharacter(item.fileName);
                }));
            }

            const newObj = { ...newData, childVideoInfo: reorderedEpisodes };
            await updateRecord(id, newObj);
        } else {

            if (processedCharacters) {
                const processedCharactersFilter = processedCharacters.filter(item => item !== null);
                await updateCharacter(id, processedCharactersFilter);
            } else {
                await Promise.all(parsedCharacterInfo.map(async (item) => {
                    await deleteCharacterRecord(id, item.id);
                    await deleteCharacter(item.fileName);
                }));
            }
            await updateRecord(id, newData);
        }

        filesToDelete?.forEach(deleteFile);
        res.status(200).json({ message: 'Update successful' });
    } catch (error) {
        filesToDelete?.forEach(deleteFile);
        console.error('Error updating record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = updateVideoController;
