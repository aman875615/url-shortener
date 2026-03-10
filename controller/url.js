const shortid = require('shortid');
const URL= require('../models/url');


async function handlegenerateNewShortUrl(req,res){
    const body= req.body;
    if(!body.url) return res.status(400).json({error:"URL is required"});   
    const shortID= shortid();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitedHistory: [],
        createdBy: req.user._id,
    });
    return res.render('home',{
        id:shortID,
    });
      
}
async function handleGetAnalytics(req,res){
    const shortId = req.params.shortid;
    const result = await URL.findOne({shortId});
    return res.json({
        totoalclicks: result.visitedHistory.length,
        analytics: result.visitedHistory,
    });
}

module.exports ={
    handlegenerateNewShortUrl,
    handleGetAnalytics,
}