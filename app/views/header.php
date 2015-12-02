<!doctype html>
<html lang="<?=lang('main_lang')?>">
<head>
    <meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="ROBOTS" content="INDEX,NOFOLLOW">
    
    <meta http-equiv="Content-Type" content="text/html; charset=<?=lang('main_charset')?>"/>
    <title><?=lang('main_sitename')?></title>
    
    <link href="<?=base_url('assets/css/layout.css')?>" media="screen, projection" rel="stylesheet" type="text/css" />
    <link href="<?=base_url('assets/css/maguna.css')?>" media="screen, projection" rel="stylesheet" type="text/css" />
    <link href="<?=base_url('assets/css/maguna_adv.css')?>" media="screen, projection" rel="stylesheet" type="text/css" />

    <script type="text/javascript" src="<?=base_url('assets/js/jquery-1.7.1.min.js')?>"></script>
    <script type="text/javascript" src="<?=base_url('assets/js/swfobject.js')?>"></script>
    <script type="text/javascript" src="<?=base_url('assets/js/soundmanager2-nodebug-jsmin.js')?>"></script>
    <script type="text/javascript" src="http://www.youtube.com/player_api"></script>
    <script type="text/javascript" src="<?=site_url('runtime')?>"></script>
</head>
<body>
    <div id="wrapper">
<?php if (!$is_home) : ?>
        <div class="page empty-home">
            <div class="page-wrapper">
            </div>
        </div>
<?php endif; ?>
        <div class="page">
            <div class="page-wrapper">
            
