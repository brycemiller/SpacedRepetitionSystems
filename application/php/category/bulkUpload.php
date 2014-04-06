<?php
/**
 * Handles a bulk upload of new categories and cards.
 * 
 * This function is experimental.
 */
ini_set('max_execution_time', '600');

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// Verify that the required post and session data exists
badKeys(array('file'), $_FILES);
badKeys(array('name', 'error'), $_FILES['file']);
badKeys(array('parent_id'), $_POST);

// Get new database abstractions for cards and categories
$dbCard = new dbCard();
$dbCategory = new dbCategory();

// Get file information
$name = $_FILES['file']['name'];
$type = $_FILES['file']['type'];
$tmpName = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$isError = false;
$errorMessage = '';

header('Content-type: text/html');

// Move error handling out to own file - it obfuscates the code here
if($error != UPLOAD_ERR_OK){
	switch($error){
		case UPLOAD_ERR_INI_SIZE :
			$errorMessage .= 'File too large<br/>';
			break;
		case UPLOAD_ERR_FORM_SIZE :
			$errorMessage .= 'File too large<br/>';
			break;
		case UPLOAD_ERR_PARTIAL :
			$errorMessage .= 'File only partially uploaded<br/>';
			break;
		case UPLOAD_ERR_NO_FILE :
			$errorMessage .= 'No file selected<br/>';
			break;
		case UPLOAD_ERR_N_TMP_DIR :
			$errorMessage .= 'No temp directory selected<br/>';
			break;
		case UPLOAD_ERR_CANT_WRITE :
			$errorMessage .= 'Could not write file to disk<br/>';
			break;
		case UPLOAD_ERR_EXTENSION :
			$errorMessage .= 'File must be a text file with ending \'.txt\'<br/>';
			break;
		
		$isError = true;
	}
}
if(substr($name, -4) != '.txt'){
	$errorMessage .= 'File must be a text file with ending \'.txt\'<br/>';
	$isError = true;
}
if($type != 'text/plain'){
	$errorMessage .= 'File must be of MIME-type text/plain<br/>';
	$isError = true;
}

if($isError){
	$errorMessage .= 'Please try again';
	sendError($errorMessage);
}
// End of error handling

// Read the file and process it
$lines = file($tmpName);
$parentIDs = array('' => $_POST['parent_id']);
$depth = '+';

// Does not handle multi-line questions/answers
foreach($lines as $line){
	$line = trim($line);
	$start = substr($line, 0, 1);
	
	// Lines starting with " are card lines (they have the form: "question";"answer")
	if($start == '"' || $cont){
		$line = split(';', $line);
		$question = str_replace('"', '', $line[0]);
		$answer = str_replace('"', '', $line[1]);
	
		$dbCard->create($_SESSION['owner_id'], $parentIDs[$depth], escape($question), escape($answer), '');
	}
	// Lines starting with a + are category lines (they have the form: ++category name)
	else if($start == '+'){
		$pluses = substr($line, 0, substr_count($line, '+'));
		$line = substr($line, substr_count($line, '+'));
		$id = $dbCategory->create($_SESSION['owner_id'], $parentIDs[$pluses], escape($line));
		$parentIDs[$pluses.'+'] = $id; 
		$depth = $pluses.'+';
	}
	// Lines with neither a " nor a + at the beginning are level 1 categories
	else{
		$id = $dbCategory->create($_SESSION['owner_id'], $parentIDs[''], escape($line));
		$parentIDs['+'] = $id;
		$depth = '+';
	}
}

ini_restore('max_execution_time');

// Send success message to front end
echo '{"success": true}';
