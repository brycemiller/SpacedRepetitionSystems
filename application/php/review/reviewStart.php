<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// get all the cards ready for review
$dbCard = new dbCard();
$cards = $dbCard->getReviewCards($_SESSION['owner_id'], $_POST['category_id'], $_POST['subcategories']);

// put the cards into the session
$_SESSION['review'] = array();

if(is_array($cards))
	foreach($cards as $card)
		$_SESSION['review'][$card['id']] = $card;

// get the first card
$firstCard = $_SESSION['review'][array_rand($_SESSION['review'])];

// if there are no cards, send empty array to front end
if($firstCard == null){
	echo '{"success": true, "card": []}';
	return;
}

// send first card to the front end
echo '{"success": true, "card": ['.$firstCard['id'].',"'.unescape($firstCard['question']).'","'.unescape($firstCard['answer']).'"]}';
