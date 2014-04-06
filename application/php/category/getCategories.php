<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);

// Get new database abstraction for categories
$dbCat = new dbCategory();
$out = '[';
// Build up flat structure representation of category tree
$out .= traverse($dbCat, 0);
$out = substr($out, 0, strlen($out)-1);
$out .= ']';

// Send data to the front end
echo $out;

/**
 * Traverses the category tree, adding a visual representation
 * of depth to an otherwise flat display structure.
 * 
 * @param	dbCategory	$dbCat			a database abstraction for categories
 * @param	int			$category_id	a category id
 * @param 	int			$depth			a string of '+' signs for showing
 * 										depth visually on a display
 * @return	a set of nodes, ready for consumption
 */
function traverse($dbCat, $category_id, $depth = ''){
	$children = $dbCat->getChildren($_SESSION['owner_id'], $category_id);
	
	if(is_array($children))
		foreach($children as $child){
			$out .= '['.$child['id'].',"'.unescape($depth.$child['text']).'"],';
			$out .= traverse($dbCat, $child['id'], $depth.'+');
		}
	
	return $out;
}
