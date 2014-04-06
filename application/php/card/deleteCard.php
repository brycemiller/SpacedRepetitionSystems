<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('card_id'), $_POST);

// Get new database abstraction for cards
$dbCard = new dbCard();

// Delete the card from the database
$dbCard->delete($_SESSION['owner_id'], $_POST['card_id']);

// Tell the front end everything went a-okay
echo '{"success": true}';
