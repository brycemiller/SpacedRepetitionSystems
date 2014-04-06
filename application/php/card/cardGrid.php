<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('category_id'), $_POST);

// Get new database abstraction for cards
$dbCard = new dbCard();

// Get all the cards for this category
$cards = $dbCard->getCards($_SESSION['owner_id'], $_POST['category_id']);

// Build up an array containing the card information for
// consumption by the card data store
$out = '';

if(is_array($cards)){
	$out = '[';
	
	foreach($cards as $card){
		$out .= '[';
		$out .= $card['id'].', '.$card['category_id'].',';
		$out .= '"'.unescape($card['question']).'","'.unescape($card['answer']).'", "'.unescape($card['hint']).'", ';
		$out .= '"'.$card['last_test'].'","'.$card['next_test'].'",';
		$out .= $card['total_test'].','.$card['tests_passed'].','.$card['pass_rate'];
		$out .= '],';
	}
	
	if(substr($out, -1) == ','){
		$out = substr($out, 0, strlen($out)-1);
	}
	
	$out .= ']';
}
else{
	$out = '[]';
}

// Send the cards to the front end
echo $out;
