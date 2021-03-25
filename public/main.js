const playList = document.getElementById('playlist');
        const pagination = document.getElementById('pagination');
        const dashboard = document.getElementsByClassName('dashboard');
        const song = document.getElementsByClassName('song');
        const player = document.getElementById('player');
        const btnLogIn = document.querySelector('[data-toggle="modal"]');
        const nav = document.getElementById('nav')
        const btnLogOut =`<form action="logout" method="post"><button type="submit" class="btn btn-primary">Đăng xuất</button></form>`;
        const noSong = 0;
        const songApp ={};
        let isPlaying = false, isRandom = false, isReplay = false;
        let currentPage =1;
        let totalPage =0;
        let perPage = 0;
        let isLogIn = `<%= isLogIn %>`
        let randomNo;

        let searchSongs = (action = null,page = 1,callback = null) =>{
            let key = document.getElementById("id").value;
            let url = '/api/timkiem/'+key +'/'+page;
            playList.innerHTML= '';
            pagination.innerHTML ='';
            fetch(url).then(res =>res.json()).then((data) =>{
                let item2='';             
                    data.listSong.forEach((ls) =>{
                        let item_song = `<div class="song" noSong="${ls.no_Song}" key_encrypt="${ls.key_encrypt}"  onclick="chooseSong('${ls.key_encrypt}',${ls.no_Song})" >
                                        <div class="thumb" style="background-image: url('${ls.img_song}')">
                                        </div>
                                        <div class="body">
                                            <h3 class="title">${ls.title_song}</h3>
                                            <p class="author">${ls.singer_song}</p>
                                        </div>
                                        <div onclick="download(${ls.key_encrypt})" class="option">
                                          <i class="fas fa-download"></i>
                                        </div>
                                    </div>`;
                        playList.innerHTML += item_song;
                    })  
                    if(data.pageCount == 1){
                        item2 += `<li class="page-item active" aria-current="page">
                                        <span class="page-link">1</span>
                                    </li>`
                    }
                    else 
                        for(let i=0; i<data.pageCount; i++){
                            item2 +=`<li class="page-item" aria-current="page" onclick="searchSongs(${i+1})">
                                        <span class="page-link">${i+1}</span>
                                    </li>`
                        }
                    pagination.innerHTML=item2;    
                    perPage = data.perPage;
                    currentPage= page;
                    totalPage = data.pageCount;
                    //console.log(totalPage)
                    let firstNo = perPage * (currentPage-1)+1;
                    let lastNo = parseInt(song[song.length-1].getAttribute('nosong'));
                    //let lastNoSongperPage = perPage*currentPage;
                    if(action != null && callback != null &&  typeof callback ==='function'){         
                      if(action == 'nextSong'){
                        setTimeout(() => {
                          callback(firstNo);    
                        }, 1000); 
                      }
                      else if(action == 'prevSong'){
                        setTimeout(() => {
                          callback(lastNo);    
                        }, 1000);
                      }
                      else {
                        setTimeout(() => {
                          console.log(randomNo);
                          callback(randomNo);    
                        }, 1000);
                      }                 
                  }
                }
            )
        }

        // let searchSongsbyPage= (key,page) =>{
        //     let url = '/api/timkiem/'+key +'/'+page;
        //     fetch(url).then(res =>res.json()).then((data) =>{
        //         let item2='';
        //         playList.innerHTML ="";
        //         data.listSong.forEach((ls) =>{
        //             let item_song = `<div class="song" noSong="${ls.no_Song}" key_encrypt="${ls.key_encrypt}"  onclick="chooseSong('${ls.key_encrypt}',${ls.no_Song})" >
        //                                 <div class="thumb" style="background-image: url('${ls.img_song}')">
        //                                 </div>
        //                                 <div class="body">
        //                                     <h3 class="title">${ls.title_song}</h3>
        //                                     <p class="author">${ls.singer_song}</p>
        //                                 </div>
        //                                 <div onclick="checkLoggin()" class="option">
        //                                     <i class="fas fa-ellipsis-h"></i>
        //                                 </div>
        //                             </div>`;
        //                 playList.innerHTML += item_song;
        //             })   
        //             if(data.pageCount == 1){
        //                 item2 += `<li class="page-item active" aria-current="page">
        //                                 <span class="page-link">1</span>
        //                             </li>`
        //             }
        //             else 
        //                 for(let i=0; i<data.pageCount; i++){
        //                     item2 +=`<li class="page-item" aria-current="page" onclick="searchSongsbyPage('${key}',${i+1})">
        //                                 <span class="page-link">${i+1}</span>
        //                             </li>`
        //                 }
        //             pagination.innerHTML=item2;   
        //             currentPage= page; 
        //         }
        //     )
        // }

        let chooseSong = (key,noSong) =>{
            for (let index = 0; index < song.length; index++) {
              song[index].classList.remove('active');
              
            }
            document.querySelector(`[key_encrypt="${key}"]`).classList.toggle('active');
            let url ="http://m.nhaccuatui.com/ajax/get-media-info?key1="+ key;
            fetch(url).then(res =>res.json()).then((data) =>{
                var audio_link= data.data.location;
                //console.log(audio_link);
                
                let item_player =`<div class="dashboard">
                            <!-- Header -->
                            <header>
                                <h4>Now playing:</h4>
                                <h2>${data.data.title}</h2>
                            </header>
                            <!-- CD -->
                            <div class="cd">
                                <div class="cd-thumb"
                                    style="background-image: url('${data.data.thumb}')">
                                </div>
                            </div>
                
                            <!-- Control -->
                            <div class="control">
                                <div class="btn btn-download" onclick="download('${key}')">
                                  <i class="fas fa-arrow-down"></i>
                                </div>
                                <div class="btn btn-prev" onclick="prevSong(${noSong})">
                                    <i class="fas fa-step-backward"></i>
                                </div>
                                <div class="btn btn-toggle-play" onclick="playSong()">
                                    <i class="fas fa-pause icon-pause"></i>
                                    <i class="fas fa-play icon-play"></i>
                                </div>
                                <div class="btn btn-next" onclick="nextSong(${noSong})">
                                    <i class="fas fa-step-forward"></i>
                                </div>
                                <div class="btn btn-random" onclick="randomSong()">
                                    <i class="fas fa-random"></i>
                                </div>
                            </div>
                            <div id="timeplay"></div>
                            <input id="progress" class="progress" type="range" value="0" step="1" min="0" max="100">
                
                            <audio id="audio" src="${audio_link}"></audio>
                        </div>`
                player.classList.add('playing');
                //isPlaying = true;     
                player.innerHTML=item_player;
                // check random 
                if(isRandom){
                  let randomBtn = document.querySelector('.btn-random');
                  randomBtn.classList.add('active');
                }       
                let audio = document.getElementById('audio');
                let progress = document.getElementById('progress');
                let timeplay = document.getElementById('timeplay');
                let mCurrentTime= `${Math.floor(audio.currentTime/60)}/${Math.floor(audio.currentTime%60)}`;
                let mDurationTime= `${Math.floor(audio.duration/60)}:${Math.floor(audio.duration%60)}`;               
                audio.play();  
                audio.ontimeupdate = ()=>{
                  if(audio.duration!= NaN){
                    isPlaying = true; 
                    const progressPercent = Math.floor((audio.currentTime / audio.duration) *100);
                    progress.value = progressPercent;
                    progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercent + '%, #d3d3d3 ' + progressPercent + '%,  #d3d3d3 100%)'
                    duringPlay(audio.currentTime,audio.duration)
                  }
                  if(progress.value == 100){
                    if(isRandom) { playRandomSong();} 
                    else nextSong(noSong);
                  }
                }
                progress.onchange= (e)=>{
                  const seekTime = (audio.duration / 100) * e.target.value;
                  audio.currentTime = seekTime;
                } 
                progress.oninput = function() {
                  console.log("oninput");
                var value = (this.value-this.min)/(this.max-this.min)*100
                this.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + value + '%, #d3d3d3 ' + value + '%,  #d3d3d3 100%)'
                }; 
            })
        } 
        let duringPlay = (current,duration) =>{
          let mDurationTime= `${Math.floor(duration/60)}`
          let sDurationTime = `${Math.floor(duration%60)}`
          let mCurrentTime = `${Math.floor(current/60)}`;
          let sCurrentTime = `${Math.floor(current%60)}`;
          if(mCurrentTime.length < 2){
            mCurrentTime =`${Math.floor(current/60)}`; 
          }
          if(sCurrentTime.length <2){
            sCurrentTime=`0${Math.floor(current%60)}`
          }
          if(mDurationTime.length <2){
            mDurationTime=`0${Math.floor(duration/60)}`
          }
          if(sDurationTime.length <2){
            sDurationTime=`0${Math.floor(duration%60)}`
          }
          let currentTime =`${mCurrentTime}:${sCurrentTime}`;
          let durationTime =`${mDurationTime}:${sDurationTime}`;
          let item_timeplay = `<p>${currentTime}/${durationTime}</p>` 
          timeplay.innerHTML=item_timeplay;
        }
        
        let playSong = function(){
            let audio = document.getElementById('audio');
            if(isPlaying == false){
                isPlaying = true;
                audio.play();
                player.classList.add('playing');
            }else{
                isPlaying = false;
                audio.pause();
                player.classList.remove('playing');
            }
        }
        let Song = (nNoSong)=>{
                let nkey_encrypt = document.querySelector(`[noSong ='${nNoSong}']`).getAttribute('key_encrypt');  
              chooseSong(nkey_encrypt,nNoSong);
              let audio = document.getElementById('audio');
        }

        let nextSong = (lNoSong) =>{
            let nNoSong = lNoSong +1;
            let lastNoSongperPage = parseInt(song[song.length-1].getAttribute('nosong'));
            console.log(nNoSong,lastNoSongperPage,currentPage,totalPage);
            if(nNoSong > lastNoSongperPage && currentPage +1 <= totalPage ){
                searchSongs('nextSong',currentPage+1,Song);
            }
            else if(nNoSong > lastNoSongperPage && currentPage +1 > totalPage){
              alert('Đây là bài cuối');
            }
            else{
                Song(nNoSong);
            }                      
        }

        let prevSong = (lNoSong) => {

          let pNoSong = lNoSong -1;
          let firstNoSongperPage = parseInt(song[0].getAttribute('nosong'));
          console.log(pNoSong,firstNoSongperPage,currentPage);
          if(pNoSong<firstNoSongperPage && currentPage-1>0){
            searchSongs('prevSong',currentPage-1,Song);
          }
          else if(parseInt(pNoSong) == 0){
            alert('Đây là bài hát đầu tiên');
          }
          else{
            Song(pNoSong);
          }

        }

      let playRandomSong = () =>{ 
         
        let rNoSong = Math.floor(Math.random() * (perPage * totalPage));
        if(rNoSong == 0) rNoSong ++;
        randomNo = rNoSong;
        let firstNoSongperPage = parseInt(song[0].getAttribute('nosong'));
        //console.log(song.length);
        let lastNoSongperPage = parseInt(song[song.length-1].getAttribute('nosong'));
        let key= document.getElementById("id").value;
        //console.log("noRandom "+rNoSong,"lastSong "+lastNoSongperPage );
        if(rNoSong > lastNoSongperPage && currentPage +1 <= totalPage ){
              searchSongs('randomSong',currentPage+1,Song);
        }
        else if(rNoSong<firstNoSongperPage && currentPage-1>0){
          searchSongs('randomSong',currentPage-1,Song);
        }
        else{
          Song(rNoSong);  
        }
      }

      let randomSong = () =>{
        let randomBtn = document.querySelector('.btn-random');
        console.log(randomBtn);
          if(isRandom == false){
            randomBtn.classList.add("active");
            isRandom = true;
            playRandomSong();    
          }
          else{
            isRandom = false; 
            randomBtn.classList.remove('active');
            //playRandomSong();
          }
        }

        // let download =(key)=>{
        //   console.log( `<%= isLogIn %>`);
        //   let url = `http://m.nhaccuatui.com/ajax/get-media-info?key1=${key}`;
        //   //let div = document.querySelector(`[key_encrypt="${key}"]`);
        //   if(`<%= isLogIn %>`== 'false'){
        //     alert('Bạn chưa đăng nhập ');
        //   }
        //   else if(`<%= isLogIn %>` == 'true'){
        //     fetch(url).then(res =>res.json()).then((data) =>{
        //       var a = document.createElement('a');
        //       a.href = `${data.data.location}`;
        //       a.download = 'download';
        //       a.click();
        //     })
        //   }                             

        // }