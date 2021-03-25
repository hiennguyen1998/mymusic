const express = require('express');
const app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.set('view engine','ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/vip',(req,res) =>{
    res.render('vip');
})
app.get('/goi-data',(req,res)=>{
    res.render('gioithieu');
})
app.use('/vip-gia-dinh',(req,res)=>{
    res.render('vipfamily');
})

const server = app.listen(7000, () =>{
    console.log('Chay thanh cong trên port 7000');
})