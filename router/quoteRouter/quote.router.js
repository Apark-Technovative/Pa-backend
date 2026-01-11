const express = require("express")
const {sendQuote} = require('../../controller/quote.controller')
const router = express.Router()


router.route("/sendQuote").post(sendQuote)

module.exports = router;