const router = require('express').Router()
const authRouter = require('./auth.routes')
const servicesRouter = require('./services.routes')
const categoriesRouter = require('./categories.routes')
const bookingRouter = require('./bookings.routes')

router.use('/auth', authRouter)
router.use('/services', servicesRouter)
router.use('/categories', categoriesRouter)
router.use('/booking', bookingRouter)

module.exports = router
export {}
