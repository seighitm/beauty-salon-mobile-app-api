const AuthController = require('./auth.controller')
const UserController = require('./user.controller')
const CategoryController = require('./category.controller')
const ServiceController = require('./service.controller')
const BookingController = require('./booking.controller')
const NotificationController = require('./notification.controller')
const CartController = require('./cart.controller')

module.exports = {
    AuthController,
    CategoryController,
    ServiceController,
    BookingController,
    NotificationController,
    UserController,
    CartController
}

export {}
