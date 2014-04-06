<?php

// SESSION TRACKING HAS BEEN SWITCHED OFF FOR THE TIME BEING
if(!isset($_COOKIE['tracker'])){
	include_once(dirname(__FILE__).'/../../../libs/php/chap/chap.php');
	$chap = new chap();
	//Set cookie to expire in 90 days
	setCookie('tracker', $chap->getChallenge(), time()+7776000);
}
else{
	session_start();
}

// get tracker id
$tracker = $_COOKIE['tracker'];

/*if(strlen($tracker) > 0){
	$dml = fopen('../tracks/'.$tracker.'.dml', 'a');
	
	$out = "v{|";
	$out.= "t{|".date('YmdHis')."|}";
	$out.= "u{|".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."|}";
	
	if(sizeOf($_POST)){
		$out.= "p{|";
		foreach($_POST as $k => $p)
			$out.= "$k{|$p|}";
		$out.= "|}";
	}
	
	if(isset($_SESSION['username']))
		$out.= "n{|".$_SESSION['username']."|}";
	$out.= "|}\n";
	
	fwrite($dml, $out);
	fclose($dml);
}*/
