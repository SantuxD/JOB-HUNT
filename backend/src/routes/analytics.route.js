const express = require('express')
const protect = require("../middlewares/auth.Middleware")
const {getEmployerAnalytics} = require("../controllers/analytics.controller")

const router = express.Router()

router.get("/overview", protect, getEmployerAnalytics)



module.exports = router;