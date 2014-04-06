<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('category_id'), $_GET);

// Get new database abstraction for cards
$dbCard = new dbCard();

// Get all the cards for this category
$cards = $dbCard->getCards($_SESSION['owner_id'], $_GET['category_id']);

// Build up an array containing the card information for
// consumption by a display object
$out = '[';

if(is_array($cards))
	foreach($cards as $card)
		$out .= '['.$card['id'].',"'.unescape($card['question']).'"],';

if(substr($out, -1) == ','){
	$out = substr($out, 0, strlen($out)-1);
}

$out .= ']';

// Send the cards to the front end
echo $out;
