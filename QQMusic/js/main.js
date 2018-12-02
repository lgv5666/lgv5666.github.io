$(function () {
    var $audio = $("audio");
    var player = new Player($audio);

    var $progress_bar = $(".music_progress_bar");
    var $music_progress_line = $(".music_progress_line");
    var $music_progress_dot = $(".music_progress_dot");
    var music_progress = new Progress($progress_bar,$music_progress_line,$music_progress_dot);
    player.music_progress = music_progress;

    var callBack = function(v){
        player.musicSeekTo(v);
    }

    music_progress.progressClick(callBack);
    music_progress.progressMove(callBack);

    var voice_progress = new Progress($(".music_voice_bar"),$(".music_voice_line"),$(".music_voice_dot"));
    voice_progress.progressClick(function (v) {
        player.changeVolume(v);
    });
    voice_progress.progressMove(function (v) {
        player.changeVolume(v);
    });


    $.ajax({
        url:"source/musiclist.json",
        dataType:"json",
        success:function (data) {
            player.musicList = data;
            var ul = $(".content_list ul");
            $.each(data,function (index, ele) {
                var item = createItem(index,ele);
                ul.append(item);
            })
        },
        error:function (e) {
            console.log(e);
        }
    });

    $(".content_list").mCustomScrollbar();

    $(".content_list").delegate(".li_music","mouseenter",function () {
        $(this).find(".list_menu_wrap").stop().fadeIn(50);
        $(this).find(".list_time span").css("visibility","hidden");
    })
    $(".content_list").delegate(".li_music","mouseleave",function () {
        var t = this;
        $(this).find(".list_menu_wrap").stop().fadeOut(50,function () {
            $(t).find(".list_time span").css("visibility","visible");
        });
    })


    $(".content_list").delegate(".li_music>.list_check","click",function () {
        $(this).toggleClass("selected");
    })
    $(".li_title>.list_check").click(function () {
        $(this).toggleClass("selected");
        $(".li_music>.list_check").toggleClass("selected");
    });

    $(".content_list").delegate(".music_play_sub","click",function () {

        player.playMusic($(this).parents("li").get(0).index,$(this).parents("li").get(0).music);
    });

    $(".clear_li").click(function () {
        $(".li_music").remove();
        $(".li_title>.list_check").trigger("click");
    });

    $(".content_list").delegate(".list_menu_del","click",function () {
        var $item = $(this).parents(".li_music");
        $item.slideUp(500,function f() {
            $item.remove();
            player.deleteMusic($item.get(0).index);

            $(".li_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index+1);
            });
        });

    })
    function createItem(index, ele) {
        var item = $("<li class=\"li_music\">\n" +
            "                        <div class=\"list_check\"></div>\n" +
            "                        <div class=\"list_number\">"+(index+1)+"</div>\n" +
            "                        <div class=\"list_name\">"+ele.name+"\n" +
            "                            <div class=\"list_menu_wrap\">\n" +
            "                                <div class=\"list_menu\">\n" +
            "                                    <a class=\"music_play_sub\" href=\"javascript:;\" title=\"播放\"><svg class=\"icon icon_list_menu\" aria-hidden=\"true\"><use xlink:href=\"#icon-bofangsanjiaoxing\"></use></svg></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"添加\"><svg class=\"icon icon_list_menu\" aria-hidden=\"true\"><use xlink:href=\"#icon-tianjia\"></use></svg></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"下载\"><svg class=\"icon icon_list_menu\" aria-hidden=\"true\"><use xlink:href=\"#icon-xiazai\"></use></svg></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"分享\"><svg class=\"icon icon_list_menu\" aria-hidden=\"true\"><use xlink:href=\"#icon-fenxiang\"></use></svg></a>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "\n" +
            "                        </div>\n" +
            "                        <div class=\"list_singer\">"+ele.singer+"</div>\n" +
            "                        <div class=\"list_time\">\n" +
            "                            <span>"+ele.time+"</span>\n" +
            "                            <div class=\"list_menu_wrap\">\n" +
            "                                <div class=\"list_menu\">\n" +
            "                                    <a class='list_menu_del' href=\"javascript:;\" title=\"删除\"><svg class=\"icon icon_list_menu\" aria-hidden=\"true\"><use xlink:href=\"#icon-shanchu\"></use></svg></a>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "\n" +
            "                        </div>\n" +
            "                    </li>");
        item.get(0).index = index;
        item.get(0).music = ele;
        return item;
    }

    $(".music_pre").click(function () {
        $(".li_music").eq(player.preIndex()).find(".music_play_sub").trigger("click");
    });

    $(".music_play").click(function () {


        if (player.currentIndex==-1){
            player.playMusic(player.currentIndex,undefined);
        } else {
            $(".li_music").eq(player.currentIndex).find(".music_play_sub").trigger("click");
        }


    });
    $(".music_next").click(function () {
        $(".li_music").eq(player.nextIndex()).find(".music_play_sub").trigger("click");
    });

});