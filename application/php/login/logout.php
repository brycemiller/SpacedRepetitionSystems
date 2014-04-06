<?php

include_once(dirname(__FILE__).'/../../../libs/php/chap/chap.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');

// destroy the session
$chap = new chap();
$chap->clearSession();

// send user to login page
$redirectURL = str_replace('php/login/logout.php', 'index.php', $_SERVER[REQUEST_URI]);
header("Location: $redirectURL");
exit;
