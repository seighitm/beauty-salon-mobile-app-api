const router = require('express').Router()
const authRouter = require('./auth.routes')
const servicesRouter = require('./services.routes')
const categoriesRouter = require('./categories.routes')

router.use('/auth', authRouter)
router.use('/services', servicesRouter)
router.use('/categories', categoriesRouter)

module.exports = router
export {}
