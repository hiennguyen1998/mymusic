const express = require('express');
const app = express();
var session =require('express-session');
var morgan = require('morgan');
var path = require('path')
var bodyParser = require('body-parser');
//let cors = require('cors');
//app.use(cors(conf.corsOptions))
// crawl dữ liệu
const ytdl = require('@ytdl/ytdl');
const flash = require('connect-flash');
const rq = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { nextTick } = require('process');
const { compile } = require('morgan');
const { resolveSoa } = require('dns');
//const { delete } = require('request-promise');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
  next();
  })

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/auth',(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
    if(username && password){
        if(username=='admin' && password=='admin'){
            req.session.loggedIn = true;
            req.session.username = username;
            req.flash('success_msg','Login successful');
            res.redirect('/tim-kiem');
        }else{
            //res.send({message:'Username or password is not correct',isLoggedin:false});
            res.redirect('/tim-kiem');
        }
    }else{
        //res.send({message:"Please enter Username and Password",isLoggedin:false});
        res.redirect('/tim-kiem');
    }
})
app.post('/logout', (req,res)=>{
    delete req.session.loggedIn;
    delete req.session.username;
    res.redirect('/tim-kiem');
})

app.get('/crawl-du-lieu',(req,res)=>{
    (async function crawler(){
        try{
            console.log('hello');
            var $ = await rq(options);
            console.log("ok1");
        }catch(err){
            return err;
        }
    const songs =$('.song_item >ul li');
    let rs= [];
    for (let i = 0; i < songs.length; i++) {
        let song = $(songs[i]);
        
        let title_song = song.find('.box_info >h3 a').text().trim();
        let singer_song = song.find('.box_info >h4 ').text().trim();
        rs.push({
            title_song,
            singer_song,
        });
    }
    console.log(rs);
    //fs.writeFileSync('rs.json',JSON.stringify(rs))
    })();
})



app.use(morgan('dev'));
app.set('view engine','ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//api tìm kiếm bài hát
app.get('/api/timkiem/:id/:page',(req,res,next)=>{
    let key = req.params.id;
    let perPage = 5;
    let page = req.params.page;
    let url = 'http://m.nhaccuatui.com/tim-kiem/bai-hat?q='+key;
    let options ={
        uri: url,
        transform: function (body){
            return cheerio.load(body);
        },
    };
    (async function crawler(){
        try{
            console.log('hello');
            var $ = await rq(options);
            console.log("ok1");
        }catch(err){
            return err;
        }
    const songs =$('.song_item >ul li');
    let rs= [];
    let no_Song = 0;
    for (let i = 0; i < songs.length; i++) {
        let song = $(songs[i]);
        let title_song = song.find('.box_info >h3 a').text().trim();
        let singer_song = song.find('.box_info >h4 ').text().trim();
        let id_song = song.find('.box_info >h3 a').attr("key");
        let key_encrypt = song.find('.item_thumb span.ic_play_circle').attr('keyencrypt');
        let img_song = song.find('div.item_thumb a > img').attr('src');
        if(key_encrypt !== undefined){
            no_Song++;
            rs.push({
                no_Song: no_Song,
                title_song,
                singer_song,
                id_song,
                key_encrypt,
                img_song,
            });
        }
        
    }
    //rs.pop();
    //let listSong = [];
    let pageCount = Math.ceil(rs.length/perPage);
    if(!page) page= 1; 
    const start = (page -1) * perPage;
    const end = page * perPage;
    //for (let i =0 ; i <rs.length ; i++) {
     //   if(rs[i].key_encrypt !== undefined){
       //     listSong.push({no_Song: i+1,rs: rs[i]});
      //  }
        
    //}
    console.log(rs);
    res.send({
        listSong: rs.slice(start, end),
        perPage: perPage,
        pageCount:pageCount,
        currentPage: page,
    });
    
    //fs.writeFileSync('rs.json',JSON.stringify(rs))
    })();
})

app.get('/vip',(req,res) =>{
    res.render('vip');
})
app.get('/goi-data',(req,res)=>{
    res.render('gioithieu');
})

app.get('/tim-kiem',(req,res)=>{
    //var request = require('request');
    //let page = req.params.page;
    //console.log(req.session);
    if(req.session.loggedIn){
        // delete req.session.loggedIn;
        // delete req.session.username;
        //console.log("log in true");
        res.render('search',{isLogIn: req.session.loggedIn, username:req.session.username});
    }
    else{
        //console.log("log in false");
        res.render('search',{isLogIn: false, username:null});
    }
})
app.use('/vip-gia-dinh',(req,res)=>{
    res.render('vipfamily');
})


const server = app.listen(7000, () =>{
    console.log('Chay thanh cong trên port 7000');
})