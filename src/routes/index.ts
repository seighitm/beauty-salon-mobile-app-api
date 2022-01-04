const router = require('express').Router()
const authRouter = require('./auth.routes')
const servicesRouter = require('./services.routes')
const categoriesRouter = require('./categories.routes')
const bookingsRouter = require('./bookings.routes')
const notificationsRouter = require('./notifications.routes')
const usersRouter = require('./users.routes')
const cartRouter = require('./cart.routes')

router.use('/auth', authRouter)
router.use('/services', servicesRouter)
router.use('/categories', categoriesRouter)
router.use('/bookings', bookingsRouter)
router.use('/notifications', notificationsRouter)
router.use('/users', usersRouter)
router.use('/cart', cartRouter)

module.exports = router
export {}
