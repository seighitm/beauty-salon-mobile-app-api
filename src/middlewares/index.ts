export {}
const ErrorHandlingMiddleware = require('./errorHandling.middleware')
const FileUploadMiddleware = require('./fileUpload.middleware')
const AuthMiddleware = require('./auth.middleware')

module.exports = {
    ErrorHandlingMiddleware,
    FileUploadMiddleware,
    AuthMiddleware
}
