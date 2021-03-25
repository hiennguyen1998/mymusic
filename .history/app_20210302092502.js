const express = require('express');
const app = express();

app.get('/',(req,res) =>{
    res.send('Day là trang web cua toi');
})
app.get('/tintuc',(req,res)=>{
    res.send('Day la trang tin tuc');
})

const server = app.listen(7000, () =>{
    console.log('Chay thanh cong trên port 7000');
})