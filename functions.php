<?php

$media_title = array(
    "四人与偶像 - Opening Song",
    "Echosmith - Cool Kids"
);

$media_poster = array(
    "http://ww3.sinaimg.cn/large/c4f4475egw1er6vtqun55j20zk0k0jth.jpg",
    "http://ww3.sinaimg.cn/large/c4f4475egw1er6vufn4oej20zk0k0q4s.jpg"
);

// ***$media_source*** 中的链接不可用，此仅为示例链接
$media_source = array(
    "http://localhost/4_Nin_to_Idol_NCOP.mp4",
    "http://localhost/Cool_Kids.mp4"
);

$random_dot = rand(0, count($media_title) - 1);

function get_media_info ($dot) {
    global $media_title, $media_poster, $media_source, $random_dot;

    switch ($dot) {
        case 'title':
            echo $media_title[$random_dot];
            break;
        case 'poster':
            echo $media_poster[$random_dot];
            break;
        case 'source':
            echo $media_source[$random_dot];
            break;
        default:
            break;
    }
}

?>