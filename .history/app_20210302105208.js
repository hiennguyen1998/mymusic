const express = require('express');
const app = express();
var morgan = require('morgan');

app.use(morgan('dev'));
app.set('view engine','ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',(req,res) =>{
    res.render('index');
})
app.get('/tintuc',(req,res)=>{
    res.render('gioithieu');
})

const server = app.listen(7000, () =>{
    console.log('Chay thanh cong trên port 7000');
})