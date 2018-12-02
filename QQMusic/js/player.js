function Player($audio) {
    return new Player.prototype.init($audio);
};

(function (window) {
    Player.prototype = {
        construct:Player,
        musicList:[],
        currentIndex:-1,
        music_progress:null,
        init:function ($audio) {
            this.$audio = $audio;
            this.audio = this.$audio.get(0);

            var $current_play_time = $(".current_play_time");
            $audio.on("timeupdate",{"player":this},function (e) {
                var totalTime = e.data.player.audio.duration;
                var currentTime = e.data.player.audio.currentTime;

                var currentTimeMin = parseInt(currentTime/60);
                var currentTimeSec = parseInt(currentTime%60);

                if (currentTimeMin<10){
                    currentTimeMin = "0"+currentTimeMin;
                }
                if (currentTimeSec<10){
                    currentTimeSec = "0"+currentTimeSec;
                }
                $current_play_time.text(currentTimeMin+":"+currentTimeSec);
                e.data.player.music_progress.setProgress(currentTime/totalTime*100);
            });

            this.$audio.on("ended",{"player":this},function (e) {
                e.data.player.lowLightLi();
            })
        },

        playMusic:function (index, music) {
            if (index==-1){
                index=0;
                music = this.musicList[0];

            }
            if (this.currentIndex==index){
                if (this.audio.paused){
                    this.audio.play();
                    this.hightLightLi();

                } else{
                    this.audio.pause();
                    this.lowLightLi();
                }
            }else{
                this.$audio.attr("src",music.link_url);
                console.log(this.audio.play());
                this.currentIndex = index;
                this.hightLightLi();
                changeMusicInfo(music);
            }

            function changeMusicInfo(music) {
                $(".music_play_info>span:first-child,.song_name>a").text(music.name);
                $(".songer_name>a").text(music.singer);
                $(".song_ablum>a").text(music.album);
                $(".music_play_info>span:last-child").text("/"+music.time);
                $(".song_img").attr("src",music.cover);
                $(".mask_bg").css("background-image","url("+music.cover+")");
            }

        },
        hightLightLi:function () {
            var $li_music =  $(".li_music");
            $li_music.eq(this.currentIndex).css("color","#ffffff");
            $li_music.eq(this.currentIndex).find(".list_number").addClass("list_number_play");
            $li_music.eq(this.currentIndex).siblings().css("color","rgba(255,255,255,0.5)");
            $li_music.eq(this.currentIndex).siblings().find(".list_number").removeClass("list_number_play");
            this.changePlayIcon();
        },
        lowLightLi:function () {
            var $li_music =  $(".li_music");
            $li_music.eq(this.currentIndex).css("color","rgba(255,255,255,0.5)");
            $li_music.eq(this.currentIndex).find(".list_number").removeClass("list_number_play");
            this.changePausedIcon();
        },
        changePlayIcon:function () {
                $(".li_music").eq(this.currentIndex).find(".music_play_sub use").attr("xlink:href","#icon-zanting");
                $(".li_music").eq(this.currentIndex).siblings().find(".music_play_sub use").attr("xlink:href","#icon-bofangsanjiaoxing");
                $(".music_play").find("use").attr("xlink:href","#icon-zanting");
        },
        changePausedIcon:function () {
            $(".li_music").eq(this.currentIndex).find(".music_play_sub use").attr("xlink:href","#icon-bofangsanjiaoxing");
            $(".music_play").find("use").attr("xlink:href","#icon-bofangsanjiaoxing");
        },
        preIndex:function () {
            var index = this.currentIndex-1;
            if (index<0){
                index = this.musicList.length-1;
            }
            return index;
        },
        nextIndex:function () {
            var index = this.currentIndex+1;
            if (index>this.musicList.length-1){
                index = 0;
            }
            return index;
        },
        deleteMusic:function (index) {

            if(index==this.currentIndex){

                if (!this.audio.paused) {
                    this.audio.pause();
                }
            }
            this.musicList.splice(index,1);
            if (index==this.currentIndex){
                this.currentIndex=-1;
            }
            if (index<this.currentIndex){
                this.currentIndex--;
            }

        },
        musicSeekTo:function (value) {
            if (!isNaN(value)){
                this.audio.currentTime = this.audio.duration*value;
            }

        },
        changeVolume:function (v) {
            if (v>=0 && v<=1){
                this.audio.volume = v;
            }
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    Window.Player = Player;

})(window);
