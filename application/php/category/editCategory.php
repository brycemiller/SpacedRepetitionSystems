<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('category_id', 'parent_id', 'name'), $_POST);

// Sanity check: category cannot be root category
if($_POST['category_id'] != 1){
	// Get new database abstraction for categories
	$dbCategory = new dbCategory();
	
	// Get the category to be updated
	$cat = $dbCategory->read($_SESSION['owner_id'], $_POST['category_id']);
	
	// Update the category
	$dbCategory->update($cat['id'], $_SESSION['owner_id'], $_POST['parent_id'], $_POST['name']);
	
	// Tell the front end everything went fine
	echo '{"success": true}';
	
	// Exit the script <-- probably not good style, should change
	//						round the ordering so that there is no
	//						need for 'exit'
	exit;
}

// Send error to front end (see note on style above)
sendError('Cannot edit category All');
