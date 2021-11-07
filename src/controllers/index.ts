const AuthController = require('./auth.controller')
const UserController = require('./user.controller')
const CategoryController = require('./category.controller')
const ServiceController = require('./service.controller')
const BookingController = require('./booking.controller')
const NotificationController = require('./notification.controller')

module.exports = {
    AuthController,
    CategoryController,
    ServiceController,
    BookingController,
    NotificationController,
    UserController
}

export {}
