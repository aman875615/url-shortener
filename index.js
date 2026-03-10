const express = require('express');
const path= require('path');
const cookieParser = require('cookie-parser');  
const { connectMongoDB } = require('./connect');
const User = require('./models/url');

const URL= require('./models/url')
const { restrictTo, ckeckForAuth} = require('./middlewares/auth');    

const UrlRouter = require("./router/url");
const staticRouter=require('./router/staticRouter');
const userRouter = require('./router/user');

const app=express();

const PORT = 8000;
connectMongoDB('mongodb://localhost:27017/short-url01')
.then(() => {
    console.log("Connected to MongoDB");
});

app.set("view engine","ejs");
app.set('views',path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ckeckForAuth);


app.use("/url",restrictTo(["user","admin"]),UrlRouter);
app.use("/user", userRouter);
app.use('/', staticRouter);


app.get('/url/:shortid',async (req,res) => {
    const shortId=req.params.shortid;
   const entry = await URL.findOneAndUpdate({
        shortId,
        
    },{
        $push:{
            visitedHistory:{
               timestamps: Date.now(),
            },
        },
    }
);
res.redirect(entry.redirectURL);
});

app.listen(PORT,() =>{ console.log(`Server is running on PORT ${PORT}`)});