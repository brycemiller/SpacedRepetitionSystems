<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('category_id', 'question', 'answer'), $_POST);

// Get new database abstraction for cards
$dbCard = new dbCard();

// Make a new card
$dbCard->create($_SESSION['owner_id'], $_POST['category_id'], $_POST['question'], $_POST['answer'], '');

// Tell the front end everything went a-okay
echo '{"success": true}';
