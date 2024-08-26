const admin = require('./adminRoute/admin')
const user = require('./userRoute/user')

function Routes(app) {
    app.use('/api/admin', admin)
    app.use('/api/user', user)
}

module.exports = Routes