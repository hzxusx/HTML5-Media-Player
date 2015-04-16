/**
 * rev-1.2
 * require jQuery & jQuery UI.
 * Created by Administrator on 2015/4/15.
 */


$(document).ready(function(){


    //Variable Area
    var cDelayer = null, //click delayer
        mStatus = true, //media status
        mContainer = $('#container'),
        mSource = $('#media-source'),
        mControls = $('#html5-controls'),
        mProgress = $('#progress-area'),
        mSound = $('#sound-area'),
        mBar = $('#sound-area .bar'),
        mPlay = $('#play-button .play'),
        mPause = $('#play-button .pause'),
        mDropper = $('#progress-area .dropper'),
        mSlider = $('#sound-area .slider'),
        mComplete = $('#progress-area .complete');



    //Functions
    function updateProgress(buff,duration){
        if (buff.length > 0){
            var start = buff.start(0),
                end = buff.end(buff.length-1);
            $('#progress-area .buffer').css({left:start*mProgress.width()/duration,width:end*mProgress.width()/duration});
        }
    }

    function updateSound(dot){
        mSource[0].volume = (100-dot)/100; //unit: px
        mSlider.css({top:(dot*100)/100});
    }

    function updateDropper(dot){
        mComplete.css({width:dot});
    }

    function seekMedia(dot){
        var mid = mSource[0],
            duration = mid.duration;
        mid.currentTime = dot*duration/mProgress.width();
    }

    function playHandler(){
        if (mPause.css('display') == 'none'){
            mPlay.hide();
            mPause.show();
            mSource[0].play();
            mStatus = false;
        } else{
            mPause.hide();
            mPlay.show();
            mSource[0].pause();
            mStatus = true;
        }
    }

    function zoomHandler(){
        screenStatus() == "full" ? exitFullscreen() : getFullscreen();
    }

    function screenStatus() {
        var sCode = null;
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||document.msFullscreenElement) {
            sCode = "full";
        } else{
            sCode = "lite";
        }
        return sCode;
    }

    function getFullscreen(){
        var dot = mContainer[0];
        if (dot.requestFullscreen) {
            dot.requestFullscreen();
        } else if (dot.webkitRequestFullscreen) {
            dot.webkitRequestFullscreen();
        } else if (dot.mozRequestFullScreen) {
            dot.mozRequestFullScreen();
        } else if (dot.msRequestFullscreen) {
            dot.msRequestFullscreen();
        }
    }

    function exitFullscreen(){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    function getFullscreenFallback(){
        mControls.css({"opacity":"0","position":"fixed"}); //reset
        mControls.hover(function(){
            mControls.css({opacity:1});
        },function(){
            mControls.css({opacity:0});
        });
    }

    function exitFullscreenFallback(){
        mControls.css({"opacity":"1","position":"relative"}); //reset
        mControls.hover(function(){
            mControls.css({opacity:1});
        },function(){
            mControls.css({opacity:1});
        });
    }

    function LeftRightProgress(dot){
        var duration = mSource[0].duration;
        if (dot == "left"){
            mSource[0].currentTime <= 9 ? mSource[0].currentTime = 0 : mSource[0].currentTime -= 9; //unit: s
        } else if(dot == "right"){
            mSource[0].currentTime >= (duration-9) ? mSource[0].currentTime = duration : mSource[0].currentTime += 9;
        }
    }

    function UpDownSound(dot){
        mSound.show(); //must be Ended by ***mSound.hide();***
        var currentPosition = mSlider.position().top; //currentPosition -> [0,100]
        if (dot == "up"){
            currentPosition <= 5 ? updateSound(0) : updateSound(currentPosition - 5); //unit: px
        } else if (dot == "down"){
            currentPosition >= 95 ? updateSound(100) : updateSound(currentPosition + 5);
        }
    }

    function screenStatusChange(){
        screenStatus() == "full" ? getFullscreenFallback() : exitFullscreenFallback();
    }

    function fullscreenError(){
        var info = "FullScreen ERROR. Please allow the permission of FullScreen OR current browser does not support the way to FullScreen.";
        alert(info);
    }



    //Body
    $(window).load(function(){
        mSource.bind('progress',function(){
            var duration = this.duration,
                buff = this.buffered;
            updateProgress(buff,duration);
        });
    });

    updateSound(50); //Init Volume (Set Default Volume); unit: px

    mDropper.draggable({
        containment:'parent',
        axis:'x',
        drag:function(){
            var currentPosition = $(this).position();
            updateDropper(currentPosition.left);
        },
        start:function(){
            mSource[0].pause();
        },
        stop:function(){
            var currentPosition = $(this).position();
            seekMedia(currentPosition.left);
            if (!mStatus){
                mSource[0].play();
            }
        }
    });

    mSlider.draggable({
        containment:'parent',
        axis:'y',
        drag:function(){
            var currentPosition = $(this).position();
            updateSound(currentPosition.top);
        }
    });

    mProgress.on('click',function(e){
        var mid = mSource[0],
            duration = mid.duration;
        mid.pause();
        var left = $(this).offset().left,
            x = e.pageX,
            start = x-left;
        mid.currentTime = start*duration/mProgress.width();
        mComplete.css({width:start});
        mDropper.css({left:start});
        if (!mStatus){
            mid.play();
        }
    });

    mBar.on('click',function(e){
        var superTop = $(this).offset().top + 8,//8 is a correction number; unit: px
            y = e.pageY,
            top = y - superTop; //top -> [-8,108]; just need [0,100]
        if (top <= 0 ){
            top = 0;
        } else if(top >= 100){
            top = 100;
        } else{
            top = y - superTop;
        }
        updateSound(top);
    });

    mSource.on('timeupdate',function(){
        var time = this.currentTime,
            duration = this.duration,
            progress = time*mProgress.width()/duration;
        mComplete.css({width:progress});
        mDropper.css({left:progress});
    });

    mSource[0].onended = function(){
        mPause.hide();
        mPlay.show();
        mDropper.css({left:0});
        mComplete.css({width:0});
    };

    //#play-button
    $('#play-button').on('click',function(){
        playHandler();
    });

    //#speaker-area
    $('#speaker-button').on("click",function(){
        mSound.css("display") == 'none' ? mSound.show() : mSound.hide();
    });

    //#zoom-area
    $('#zoom-area').on('click',function(){
        zoomHandler();
    });

    //forbid right click on video
    mContainer.bind("contextmenu",function(e){
        return false;
    });

    //click on video
    mSource.bind("click",function(){
        clearTimeout(cDelayer);
        cDelayer = setTimeout(function(){
            playHandler();
        }, 300);
    });

    //double click on video
    mSource.bind("dblclick",function(){
        clearTimeout(cDelayer);
        zoomHandler();
    });

    //listen keyboard
    $(document).keyup(function(e){
        switch (e.keyCode){
            case 13: zoomHandler();
                break; // Enter ×IE
            case 27: exitFullscreen();
                break; //Esc
            case 32: playHandler();
                break; //Space
            case 37: LeftRightProgress("left");
                break; //Left Arrow
            case 38: UpDownSound("up"); mSound.hide();
                break; //Up Arrow
            case 39: LeftRightProgress("right");
                break; //Right Arrow
            case 40: UpDownSound("down"); mSound.hide();
                break; //Down Arrow
            default:
                break;
        }
    });

    //#time-area
    window.onload = mSource.on({
        "loadedmetadata":function(){
            var arr = new Array(2),
                gTime_1 = mSource[0].duration,
                gTime_2 = Math.floor(gTime_1 - Math.floor(gTime_1/60)*60),
                gTime_3 = Math.floor(gTime_1/60) + ":" + (arr.join(0)+gTime_2).slice(-2);
            $('#time-area .total').html(gTime_3);
        },
        "timeupdate":function(){
            var arr = new Array(2),
                gTime_1 = mSource[0].currentTime,
                gTime_2 = Math.floor(gTime_1 - Math.floor(gTime_1/60)*60),
                gTime_3 = Math.floor(gTime_1/60) + ":" + (arr.join(0)+gTime_2).slice(-2);
            $('#time-area .current').html(gTime_3);
        }
    });

    //listener fullscreen change
    document.addEventListener("fullscreenchange", screenStatusChange);
    document.addEventListener("webkitfullscreenchange", screenStatusChange);
    document.addEventListener("mozfullscreenchange", screenStatusChange);
    document.addEventListener("MSFullscreenChange", screenStatusChange);

    //listener fullscreen error
    document.addEventListener("fullscreenerror", fullscreenError);
    document.addEventListener("webkitfullscreenerror", fullscreenError);
    document.addEventListener("mozfullscreenerror", fullscreenError);
    document.addEventListener("MSFullscreenError", fullscreenError);

});
