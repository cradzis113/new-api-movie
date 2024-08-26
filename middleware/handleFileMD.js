const multer = require('multer')

const handleFileMD = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const extension = file.originalname.split('.').pop();
            const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
        }
    });

    const handleFile = multer({ storage: storage });
    return handleFile.fields([{ name: 'video' }, { name: 'image' }, { name: 'characterImage' }]);
};

module.exports = handleFileMD