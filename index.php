<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <title>HTML5 Media Player</title>

    <style>
        html, body, div, p, a, span, h1 { margin: 0; padding: 0; border: 0; }
        body {
            line-height: 0;
            font-family: "Helvetica Neue", "Segoe UI", Helvetica, Arial, "Microsoft JhengHei", sans-serif;
            background-color: transparent;
        }
        h1 {
            margin: 24px 0;
            color: #333;
            line-height: 1;
            text-align: center;
            font-size: 32px;
            font-weight: normal;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        video {
            width: 100%;
            height: 100%;
        }
        a {
            color: #21B3A3;
            text-decoration: none;
            border-bottom: 1px dotted #555;
        }
        a:hover {
            color: #e8554e;
        }
        #wrapper {
            margin: 0 auto;
            width: 100%;
            min-width: 640px;
            max-width: 860px;
        }
        #footer {
            margin: 15px 0;
            font-size: 16px;
            font-weight: 600;
            line-height: 2;
            text-align: center;
        }
    </style>
    <link rel="stylesheet" href="style.css">

    <script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
</head>

<body>
    <?php include 'functions.php'; ?>

    <h1><?php get_media_info('title'); ?></h1>

    <div id="wrapper">

        <div id="container">

            <video id="media-source" width="640" height="360" poster="<?php get_media_info('poster'); ?>">
                <source src="<?php get_media_info('source'); ?>" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                Your browser does not support the video tag.
            </video>

            <div id="html5-controls">

                <div id="play-button" class="circle">
                    <div class="play"></div>
                    <div class="pause">
                        <div class="bar-1"></div>
                        <div class="bar-2"></div>
                    </div>
                </div>

                <div id="progress-area">
                    <div class="buffer"></div>
                    <div class="complete"></div>
                    <div class="dropper"></div>
                </div>

                <div id="time-area">
                    <span class="current">0:00</span>
                    <span> / </span>
                    <span class="total">0:00</span>
                </div>

                <div id="zoom-area" class="circle">
                    <div class="icon">
                        <div class="button"></div>
                    </div>
                </div>

                <div id="speaker-area">
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
                </div>

            </div>

            <div class="clear"></div>
        </div>

        <div id="footer">
            <p><a href="https://github.com/MinonHeart/HTML5-Media-Player">GitHub</a> === Source Code === <a href="http://me.hub.moe">2B PENCILS</a></p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>