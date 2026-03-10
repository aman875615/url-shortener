const express= require('express');
const {handlegenerateNewShortUrl,handleGetAnalytics }= require('../controller/url')

const router= express.Router();

router.post("/", handlegenerateNewShortUrl);
router.get('/analytics/:shortid',handleGetAnalytics);

module.exports= router;