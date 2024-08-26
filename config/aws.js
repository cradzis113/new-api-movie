const AWS = require('aws-sdk')
require('dotenv').config()

const acccessKey = process.env.ACCESS_KEY
const secretKey = process.env.SECRET_KEY

function awsService() {
    AWS.config.update({
        accessKeyId: acccessKey,
        secretAccessKey: secretKey,
        region: 'hn',
        endpoint: 'https://hn.ss.bfcplatform.vn',
        apiVersions: {
            s3: '2006-03-01'
        },
        logger: process.stdout
    })
}

module.exports = awsService;
