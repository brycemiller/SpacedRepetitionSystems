<?php

include_once(dirname(__FILE__).'/../session/sessionTracking.php');

// send the suggestion to me
mail('suggest@srslearning.com',
	 'New suggestion',
	 $_POST['suggestion'],
	 'From: '.$_SESSION['username']);

// return success to front end
echo '{"success": true}';
