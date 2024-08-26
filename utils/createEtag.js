const fs = require('fs')
const crypto = require('crypto')

const chunk = 1024 * 1024 * 5; // 5MB

const md5 = data => crypto.createHash('md5').update(data).digest('hex');

const createEtag = (path) => {
    const stream = fs.readFileSync(path);

    if (stream.length <= chunk) {
        return `"${md5(stream)}"`;
    }

    const md5Chunks = [];
    const chunksNumber = Math.ceil(stream.length / chunk);

    for (let i = 0; i < chunksNumber; i++) {
        const chunkStream = stream.slice(i * chunk, (i + 1) * chunk);
        md5Chunks.push(md5(chunkStream));
    }

    return `"${md5(Buffer.from(md5Chunks.join(''), 'hex'))}-${chunksNumber}"`;
};

module.exports = createEtag;