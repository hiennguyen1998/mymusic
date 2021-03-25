const ytgets = require('yt-gets');

ytgets.fetch('https://www.youtube.com/watch?v=V5GS5ANG96M').then((data)=>{
    console.log(data.media);
}).catch((err)=>{
    console.log(err)
})