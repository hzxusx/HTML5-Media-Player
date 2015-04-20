/**
 * rev-1.3
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
    function browserType(){
        var bCode = (!!window.ActiveXObject || "ActiveXObject" in window) ? "+IE" : "-IE";
        return bCode;
    }

    function screenStatus() {
        var sCode = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||document.msFullscreenElement) ? "full" : "lite";
        return sCode;
    }

    function screenStatusChange(){
        screenStatus() == "full" ? getFullscreenFallback() : exitFullscreenFallback();
    }

    function fullscreenError(){
        alert("FullScreen ERROR. Please allow the permission of FullScreen OR current browser does not support the way to FullScreen.");
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

    function timeHandler (param){
        var second = Math.floor(param - Math.floor(param/60)*60),
            secondContainer = new Array(2),
            timeZone = Math.floor(param/60) + ":" + (secondContainer.join(0)+second).slice(-2);
        return timeZone;
    }

    function updateSound(position){
        mSource[0].volume = (100-position) / 100; //unit: px
        mSlider.css({top:(position*100) / 100});
    }

    function zoomHandler(){
        screenStatus() == "full" ? exitFullscreen() : getFullscreen();
    }

    function getFullscreen(){
        var wrapper = mContainer[0];
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.webkitRequestFullscreen) {
            wrapper.webkitRequestFullscreen();
        } else if (wrapper.mozRequestFullScreen) {
            wrapper.mozRequestFullScreen();
        } else if (wrapper.msRequestFullscreen) {
            wrapper.msRequestFullscreen();
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

    function updateBuffer(){
        var duration = mSource[0].duration,
            buffer = mSource[0].buffered;
        if (buffer.length > 0){
            var start = buffer.start(0),
                end = buffer.end(buffer.length-1);
            $('#progress-area .buffer').css({left:start*mProgress.width()/duration,width:end*mProgress.width()/duration});
        }
    }

    function updateDropper(position){
        mComplete.css({width:position});
    }

    function updateComplete(){
        var currentTime = mSource[0].currentTime,
            duration = mSource[0].duration,
            progress = currentTime * mProgress.width() / duration; 
        mComplete.css({width:progress});
        mDropper.css({left:progress});
    }

    function mediaEnded(){
        mPause.hide();
        mPlay.show();
        mDropper.css({left:0});
        mComplete.css({width:0});
    }

    function UpDownSound(string){
        mSound.show();
        var currentPosition = mSlider.position().top; //currentPosition -> [0,100]
        if (string == "up"){
            currentPosition <= 5 ? updateSound(0) : updateSound(currentPosition - 5); //unit: px
        } else if (string == "down"){
            currentPosition >= 95 ? updateSound(100) : updateSound(currentPosition + 5);
        }
    } //must be Ended by ***mSound.hide();***

    function LeftRightProgress(string){
        if (string == "left"){
            mSource[0].currentTime <= 5 ? mSource[0].currentTime = 0 : mSource[0].currentTime -= 5; //unit: s
        } else if(string == "right"){
            mSource[0].currentTime >= (mSource[0].duration-5) ? mSource[0].currentTime = mSource[0].duration : mSource[0].currentTime += 5;
        }
    }



    //Body
    updateSound(50); //Init Volume (Set Default Volume); [0,100]; unit: px

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
            var currentPosition = $(this).position(),
                duration = mSource[0].duration;
            mSource[0].currentTime = currentPosition.left * duration / mProgress.width();
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

    mContainer.on("contextmenu",function(){
        return false;
    });

    mProgress.on('click',function(e){
        var duration = mSource[0].duration; mSource[0].pause();
        var left = $(this).offset().left,
            x = e.pageX,
            start = x-left;
        mSource[0].currentTime = start * duration / mProgress.width();
        if (!mStatus){
            mSource[0].play();
        }
    });

    mBar.on('click',function(e){
        var superTop = $(this).offset().top + 8, //8 is a correction number; unit: px
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

    $('#play-button').on('click',function(){
        playHandler();
    });

    $('#speaker-button').on("click",function(){
        mSound.css("display") == 'none' ? mSound.show() : mSound.hide();
    });

    $('#zoom-area').on('click',function(){
        zoomHandler();
    });

    //listen keyboard
    if (browserType() == "+IE"){
        $(document).on({
            "keypress":function(event){
                switch (event.which){
                    case 13: // Enter
                        zoomHandler();
                        break;
                    default:
                        break;
                }
            },
            "keydown":function(event){
                switch (event.which){
                    case 27: //Esc
                        exitFullscreen();
                        break;
                    case 37: //Left Arrow
                        LeftRightProgress("left");
                        break;
                    case 38: //Up Arrow
                        UpDownSound("up"); mSound.hide();
                        break;
                    case 39: //Right Arrow
                        LeftRightProgress("right");
                        break;
                    case 40: //Down Arrow
                        UpDownSound("down"); mSound.hide();
                        break;
                    default:
                        break;
                }
            },
            "keyup":function(event){
                switch (event.which){
                    case 32: //Space
                        playHandler();
                        break;
                    default:
                        break;
                }
            }
        });
    } else if(browserType() == "-IE"){
        $(document).on('keydown',function(event){
            switch (event.which){
                case 13: // Enter
                    zoomHandler();
                    break;
                case 27: //Esc
                    exitFullscreen();
                    break;
                case 32: //Space
                    playHandler();
                    break;
                case 37: //Left Arrow
                    LeftRightProgress("left");
                    break;
                case 38: //Up Arrow
                    UpDownSound("up"); mSound.hide();
                    break;
                case 39: //Right Arrow
                    LeftRightProgress("right");
                    break;
                case 40: //Down Arrow
                    UpDownSound("down"); mSound.hide();
                    break;
                default:
                    break;
            }
        });
    }


    mSource.on({
        "click":function(){
            clearTimeout(cDelayer);
            cDelayer = setTimeout(function(){
                playHandler();
            }, 300);
        },
        "dblclick":function(){
            clearTimeout(cDelayer);
            zoomHandler();
        },
        "ended":function(){
            mediaEnded();
        },
        "progress":function(){
            updateBuffer();
        },
        "timeupdate":function(){
            updateComplete();

            var param = mSource[0].currentTime;
            $('#time-area .current').html(timeHandler(param));
        },
        "loadedmetadata":function(){
            var param = mSource[0].duration;
            $('#time-area .total').html(timeHandler(param));
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
