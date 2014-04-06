<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('category_id'), $_POST);

// Get new database abstraction for categories
$dbCategory = new dbCategory();

// Remove category from database (actually, just set a flag)
$dbCategory->delete($_SESSION['owner_id'], $_POST['category_id']);

// Return successful
echo '{"success": true}';
