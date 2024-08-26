const dataMovie = require('../models/dataMovie');

const retryOperation = async (operation, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (error.name === 'VersionError' && attempt < retries) {
                console.warn(`VersionError on attempt ${attempt}, retrying...`);
            } else {
                throw error;
            }
        }
    }
};

const updateCharacter = async (id, newCharacters) => {
    if (!Array.isArray(newCharacters)) {
        throw new Error('newCharacters must be an array');
    }

    for (const newCharacter of newCharacters) {
        await retryOperation(async () => {
            const existingDocument = await dataMovie.findById(id);
            if (!existingDocument) {
                throw new Error('Document not found');
            }

            if (!existingDocument.character || !Array.isArray(existingDocument.character)) {
                existingDocument.character = [];
            }

            existingDocument.character.push(newCharacter);
            await existingDocument.save();
        });
    }
};

module.exports = updateCharacter;
