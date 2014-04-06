<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('parent_id', 'name'), $_POST);

// Get new database abstraction for categories
$dbCategory = new dbCategory();

// Make new category in the database
$dbCategory->create($_SESSION['owner_id'], $_POST['parent_id'], $_POST['name']);

// Tell front end everything went well
echo '{"success": true}';
