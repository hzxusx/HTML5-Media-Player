/**
 * rev-1.1
 * require jQuery & jQuery UI.
 * Created by Administrator on 2015/4/15.
 */

$(document).ready(function(){


    //Variable Area
    var mStatus = true,
        mSource = $('#media-source'),
        mControls = $('#html5-controls'),
        mProgress = $('#progress-area'),
        mZoom = $('#zoom-area'),
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

    function updateSound(sound){
        mSource[0].volume = (100-sound)/100;
        mSlider.css({top:(sound*100)/100});
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

    function soundArea(){
        if (mSound.css("display") == 'none'){
            mSound.show();
        } else{
            mSound.hide();
        }
    }

    function zoomHandler(){
        if (document.msFullscreenElement || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement){
            exitFullscreen();
        } else{
            getFullscreen();
        }
    }

    function getFullscreen(){
        var e = $('#container')[0];
        if (e.requestFullscreen) { e.requestFullscreen(); }
        else if (e.msRequestFullscreen) { e.msRequestFullscreen(); }
        else if (e.mozRequestFullScreen) { e.mozRequestFullScreen(); }
        else if (e.webkitRequestFullscreen) { e.webkitRequestFullscreen(); }
        getFullscreenFallback();
    }

    function exitFullscreen(){
        exitFullscreenFallback();
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
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

    function UpDownSound(dot){
        mSound.show(); //must be Ended by ***mSound.hide();***
        var currentPosition = mSlider.position().top; //currentPosition -> [0,100]
        if (dot == 0){
            if (currentPosition <= 5){
                updateSound(0);
            } else{
                updateSound(currentPosition - 5);
            }
        } else if (dot == 1){
            if (currentPosition >= 95){
                updateSound(100);
            } else{
                updateSound(currentPosition + 5);
            }
        }
    }



    //Body
    $(window).load(function(){
        mSource.bind('progress',function(){
            var duration = this.duration,
                buff = this.buffered;
            updateProgress(buff,duration);
        });
    });

    //Init Volume (Set Default Volume)
    updateSound(50);

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
        var superTop = $(this).offset().top + 8, //8 is a correction number
            y = e.pageY,
            top = y - superTop; //top -> [-8,108]. just need [0,100]
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
        soundArea();
    });

    //#zoom-area
    mZoom.on('click',function(){
        zoomHandler();
    });

    //No Right Click on Video
    $('#container').bind("contextmenu",function(e){
        return false;
    });

    //Click on Video
    mSource.on("click",function(){
        playHandler();
    });

    //Double Click on Video
    mSource.bind("dblclick",function(){
        zoomHandler();
    });

    //listen keyboard
    $(document).keyup(function(e){
        switch (e.keyCode){
            case 13: zoomHandler();
                break; // Enter ×IE
            case 27: exitFullscreen();
                break; //Esc ×Firefox
            case 32: playHandler();
                break; //Space
            case 37:
                break; //Left Arrow
            case 38: UpDownSound(0); mSound.hide();
                break; //Up Arrow
            case 39:
                break; //Right Arrow
            case 40: UpDownSound(1); mSound.hide();
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
                time = Math.floor(gTime_1 - Math.floor(gTime_1/60)*60),
                gTime_2 = Math.floor(gTime_1/60) + ":" + (arr.join(0)+time).slice(-2);
            $('#time-area .total').html(gTime_2);
        },
        "timeupdate":function(){
            var arr = new Array(2),
                gTime_1 = mSource[0].currentTime,
                time = Math.floor(gTime_1 - Math.floor(gTime_1/60)*60),
                gTime_2 = Math.floor(gTime_1/60) + ":" + (arr.join(0)+time).slice(-2);
            $('#time-area .current').html(gTime_2);
        }
    });


});
