<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('owner_id'), $_SESSION);
badKeys(array('node'), $_POST);

// Get new database abstraction for categories
$dbCat = new dbCategory();

if($_POST['node'] == 0){
	unset($_SESSION['catKids']);
	unset($_SESSION['cardCounts']);
	unset($_SESSION['reviewCounts']);
}

// Get all the child nodes for this category
// ^currently using the experimental 'fast' version
$tree = $dbCat->getChildrenFast($_SESSION['owner_id'], $_POST['node'], true, true);

// Build up output
$out = '[';

if(is_array($tree))
	foreach($tree as $node){
		$node['text'] .= ($node['rev'] == 0 ? '' : '&nbsp;&nbsp;<span style="color:green">'.$node['rev'].'</span>').'&nbsp;('.$node['num'].')';
		$node['text'] = unescape($node['text']);
		$node['name'] = unescape($node['name']);
		$out .= json_encode($node).',';
	}

$out = substr($out, 0, strlen($out)-1);
$out .= ']';

// Send categories to front end
echo $out;
