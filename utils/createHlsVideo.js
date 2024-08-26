const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

async function createHlsVideo(inputFile, outputFileName) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    const videoDirectory = path.join(__dirname, '..', 'video', outputFileName);

    if (!fs.existsSync(videoDirectory)) {
        fs.mkdirSync(videoDirectory, { recursive: true });
    }

    try {
        await fs.promises.copyFile(inputFile, path.join(videoDirectory, path.basename(inputFile)));
    } catch (err) {
        console.error('Error copying input file:', err);
        throw err;
    }

    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .addOptions([
                '-threads 0', // Sử dụng tất cả các luồng có sẵn
                '-preset ultrafast', // Tùy chọn chất lượng và tốc độ xử lý
            ])
            .outputOptions('-hls_time 10') // set segment duration to 10 seconds
            .outputOptions('-hls_list_size 0') // keep all the segments in the playlist
            .output(`${videoDirectory}/${outputFileName}.m3u8`)
            .on('end', () => {
                console.log('HLS created successfully');
                resolve(videoDirectory);
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err);
                reject(err);
            })
            .run();
    });
}

module.exports = createHlsVideo;
