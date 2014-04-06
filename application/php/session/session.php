<?php

include_once(dirname(__FILE__).'/../../../libs/php/chap/chap.php');

// start the session
session_start();

// if the session hasn't been authorised,
// send the user back to the login page
if(!$_SESSION[CH.'Passed'])
{
	header("Location: index.php");
	exit;
}
