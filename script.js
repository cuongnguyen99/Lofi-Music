const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

const heading = select('.header__song');
const cd = select('.main__cd');
const audio = select('#audio');
const playBtn = select('.btn-main');
const main = select('.main');
const process = select('#progress');
const nextBtn = select('.btn-next');
const backBtn = select('.btn-back');
const loopBtn = select('.btn-loop');
const randomBtn = select('.btn-random');
const playList = select('.list');

let isRandom = false;
let isLoop = false;
let isPlay = false;

const app = {
    currenIndex: 0,
    songs: [{
            name: 'Lần hẹn hò đầu tiên',
            singer: 'Huyền Tâm Môn',
            path: './assets/music/1.mp3',
            image: './assets/img/1.jpg'
        },
        {
            name: 'Phố đã lên đèn',
            singer: 'Huyền Tâm Môn',
            path: './assets/music/2.mp3',
            image: './assets/img/2.jpg'
        },
        {
            name: 'Một mình có buồn không',
            singer: 'Thiều Bảo Trâm',
            path: './assets/music/3.mp3',
            image: './assets/img/3.jpg'
        },
        {
            name: '3107 - 3',
            singer: 'W/n x ( Nâu,Duongg,Titie )',
            path: './assets/music/4.mp3',
            image: './assets/img/4.jpg'
        },
        {
            name: 'Từ chối nhẹ nhàng thôi',
            singer: 'Phúc Du ft Bích Phương',
            path: './assets/music/5.mp3',
            image: './assets/img/5.jpg'
        },
        {
            name: 'Sài gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền ft. Hoàng Duyên',
            path: './assets/music/6.mp3',
            image: './assets/img/6.jpg'
        },
        {
            name: 'Đã lỡ yêu em nhiều',
            singer: 'Justa tee',
            path: './assets/music/7.mp3',
            image: './assets/img/7.jpg'
        },
        {
            name: 'Đánh mất em',
            singer: 'Quang Đăng Trần',
            path: './assets/music/8.mp3',
            image: './assets/img/8.jpg'
        },
        {
            name: 'Anh mệt rồi',
            singer: 'Anh Tú',
            path: './assets/music/9.mp3',
            image: './assets/img/9.jpg'
        },
        {
            name: 'Hoa nở không màu',
            singer: 'Hoài Lâm',
            path: './assets/music/10.mp3',
            image: './assets/img/10.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((item, index) => {
            return `
                <div data-index="${index}" class="song ${index === this.currenIndex ? 'active' : ''}">
                    <div class="song__picture" style="background-image: url('${item.image}')"></div>
                    <div class="song__content">
                        <div class="song__name">${item.name}</div>
                        <div class="song__single">${item.singer}</div>
                    </div>
                ` 
                +
                    /*<div class="song__option">
                    //     <i class="fas fa-ellipsis-h"></i>
                    // </div>*/
                `
                </div>
            `;
        });
        select('.list').innerHTML = htmls.join('');
    },
    setDefault: function() {
        if (select('.main.playing')) {
            main.classList.remove('playing');
        }
        // setSongDefault.classList.add('active');
    },
    loadCurrentSong: function() {
        heading.textContent = this.songs[this.currenIndex].name;
        cd.style.backgroundImage = `url('${this.songs[this.currenIndex].image}')`;
        audio.src = this.songs[this.currenIndex].path;

        if(select('.song.active')){
            select('.song.active').classList.remove('active');
        }
        let allSong = selectAll('.song');
        allSong[this.currenIndex].classList.add('active');
    },
    nextSong: function() {
        this.currenIndex++;
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0;
        }
        this.scrollToActive();
    },
    backSong: function() {
        this.currenIndex--;
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1;
        }
        this.scrollToActive();
    },
    playRandomSong: function() {
        let tmp = Math.floor(Math.random() * this.songs.length);
        do {
            this.currenIndex = tmp;
        } while (tmp !== this.currenIndex)
        this.loadCurrentSong();
    },
    scrollToActive: function() {
        setTimeout(() => {
            let scrollInto = select('.song.active');
            scrollInto.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            }); 
        }, 500)
    }
    ,
    hendlerEvents: function() {
        const _this = this;
        // Xử lý khi click play
        audio.onplay = function() {
            isPlay = true;
            cdRotate.play();
            main.classList.add('playing');
        }
        audio.onpause = function() {
            isPlay = false;
            main.classList.remove('playing');
            cdRotate.pause();
        }
        playBtn.onclick = function() {
            if (isPlay) {
                audio.pause();
                main.classList.remove('playing');
                cdRotate.pause();
            } else {
                audio.play();
                main.classList.add('playing');
                cdRotate.play();
                
            }
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    let percent = (audio.currentTime / audio.duration) * 100;
                    percent = percent.toFixed(2);
                    process.value = percent;
                }
            }
            // Khi tua trên progress
        process.oninput = function() {
                let seek = (process.value * audio.duration) / 100;
                audio.currentTime = seek;
            }
            // Quay đĩa 
        let cdRotate = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity
        })
        cdRotate.pause();
        // Next bài hát
        nextBtn.onclick = function() {
            if (isRandom) {
                _this.playRandomSong();
            } else {
                let tmp = select('.main.playing');
                if (tmp) {
                    _this.nextSong();
                    _this.loadCurrentSong();
                } else {
                    _this.nextSong();
                    _this.loadCurrentSong();
                    cdRotate.play();
                }

            }
            audio.play();
        }
        backBtn.onclick = function() {
            if (isRandom) {
                _this.playRandomSong();
            } else {
                let tmp = select('.main.playing');
                if (tmp) {
                    _this.backSong();
                    _this.loadCurrentSong();
                } else {
                    _this.backSong();
                    _this.loadCurrentSong();
                    cdRotate.play();
                }
            }
            audio.play();
        }
        // Random bài hát
        randomBtn.onclick = function() {
            let check = select('.btn-random.active');
            if (check) {
                randomBtn.classList.remove('active');
                isRandom = false;
            } else {
                randomBtn.classList.add('active');
                isRandom = true;
            }
        }
        // Loop 1 bài hát
        loopBtn.onclick = function (){
            let check = select('.btn-loop.active');
            if(check) {
                loopBtn.classList.remove('active');
                isLoop = false;
            }
            else{
                loopBtn.classList.add('active');
                isLoop = true;
            }
        }
        
        // Khi end bài hát
        audio.onended = function() {
            if(isLoop == true){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        // Khi ấn vào 1 bài hát
        playList.onclick = function(e) {
            let nowActive = e.target.closest('.song:not(.active)');
            if(nowActive){
                _this.currenIndex = nowActive.dataset.index;
                _this.loadCurrentSong();
                audio.play();
            }
        }
    },
    start: function() {
        // set default value
        this.setDefault();
        // Render giao diện
        this.render();
        // Load bài hát đầu tiên
        this.loadCurrentSong();
        // Bắt các sự kiện của dom
        this.hendlerEvents();
    }
}
app.start();