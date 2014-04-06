<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('card_id', 'category_id', 'question', 'answer'), $_POST);

// Get new database abstraction for cards
$dbCard = new dbCard();

// Find the card in the database, and update it
$card = $dbCard->read($_SESSION['owner_id'], $_POST['card_id']);
$dbCard->update($card['id'], $_SESSION['owner_id'], $_POST['category_id'], $_POST['question'],
				$_POST['answer'], $card['hint'], $card['deck'], $card['last_test'],
				$card['next_test'], $card['total_test'], $card['tests_passed']);

// Tell the front end everything went great
echo '{"success": true}';
