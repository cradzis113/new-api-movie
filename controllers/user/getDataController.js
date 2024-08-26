const getRecord = require('../../utils/getRecord')

async function getDataController(req, res) {
    try {
        const recordData  = await getRecord()
        res.send(recordData)
    } catch (error) {
        console.log(error)
    }
}

module.exports = getDataController