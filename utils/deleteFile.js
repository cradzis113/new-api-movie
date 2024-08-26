const fs = require('fs');

function deleteFile(pathToDelete) {
    return new Promise((resolve, reject) => {
        fs.access(pathToDelete, fs.constants.F_OK, (err) => {
            if (err) {
                reject(new Error(`Path ${pathToDelete} does not exist`));
            } else {
                fs.rm(pathToDelete, { recursive: true }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Deleted path: ${pathToDelete}`);
                    }
                });
            }
        });
    });
}

module.exports = deleteFile;
