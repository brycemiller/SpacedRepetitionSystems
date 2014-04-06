<?php
// lots of duplicate code here when compared to reviewStart
// rule of three violation; refactor

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

$dbCard = new dbCard();

switch($_GET['instruction']){
	case 'skip':
		//Do nothing
		break;
	case 'correct':
		$card = $dbCard->read($_SESSION['owner_id'], $_GET['card_id']);
		
		// shift it up one deck, modify the details
		$deck = $card['deck']+1;
		$last_test = date('Y-m-d H:i:s');
		$next_test = date('Y-m-d H:i:s', time()+($deck*86400));
		$next_test = substr($next_test, 0, 11).'03:30:00';
		$total_test = $card['total_test']+1;
		$tests_passed = $card['tests_passed']+1;
		
		// write the modifications to the database
		$dbCard->update($card['id'], $card['owner_id'], $card['category_id'], $card['question'], $card['answer'], 
						$card['hint'], $deck, $last_test, $next_test,
						$total_test, $tests_passed);
		
		// remove the card from the list
		unset($_SESSION['review'][$_GET['card_id']]);
		break;
	case 'wrong':
		// get the card
		$card = $dbCard->read($_SESSION['owner_id'], $_GET['card_id']);
		
		// reset to first deck, modify the details
		$deck = 0;
		$last_test = date('Y-m-d H:i:s');
		$next_test = $last_Test;
		$total_test = $card['total_test']+1;
		$tests_passed = $card['tests_passed'];

		// write the modifications to the database			
		$dbCard->update($card['id'], $card['owner_id'], $card['category_id'], $card['question'], $card['answer'], 
						$card['hint'], $deck, $last_test, $next_test,
						$total_test, $tests_passed);
		break;
}

// get the next card
$nextCard = $_SESSION['review'][array_rand($_SESSION['review'])];

// if the card is empty, send empty array to front end
if($nextCard == null){
	echo '{"success": true, "card": []}';
	
	exit;
}

// send next card to front end
echo '{"success": true, "card": ['.$nextCard['id'].',"'.unescape($nextCard['question']).'","'.unescape($nextCard['answer']).'"]}';
