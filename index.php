<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    
    <title>HTML5 Media Player</title>

    <link rel="stylesheet" href="style.css">

    <script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
</head>

<body>
    <div id="wrapper">
        <header id="header"><?php include 'functions.php'; get_media_info('title'); ?></header>

        <div id="container">

            <video id="media-source" width="640" height="360" poster="<?php get_media_info('poster'); ?>" preload="auto">
                <source src="<?php get_media_info('source'); ?>" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
                Current browser does not support the video tag.
            </video>

            <div id="html5-controls">

                <section id="play-button" class="circle">
                    <div class="play"></div>
                    <div class="pause">
                        <div class="bar-1"></div>
                        <div class="bar-2"></div>
                    </div>
                </section>

                <section id="progress-area">
                    <div class="buffer"></div>
                    <div class="complete"></div>
                    <div class="dropper"></div>
                </section>

                <section id="time-area">
                    <span class="current">0:00</span>
                    <span> / </span>
                    <span class="total">0:00</span>
                </section>

                <section id="zoom-area" class="circle">
                    <div class="icon">
                        <div class="button"></div>
                    </div>
                </section>

                <section id="speaker-area">
                    <div id="speaker-button" class="circle">
                        <div class="icon-1"></div>
                        <div class="icon-2"></div>
                        <div class="icon-3"></div>
                    </div>
                    <div id="sound-area">
                        <div class="bar">
                            <div class="slider"></div>
                        </div>
                    </div>
                </section>

            </div>

            <div class="clear"></div>
        </div>

        <footer id="footer"></footer>
    </div>

    <script src="script.js"></script>
</body>
</html>