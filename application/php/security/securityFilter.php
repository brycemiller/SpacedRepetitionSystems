<?php

/**
 * Filters all in-coming data as well as providing
 * functions for detecting data missing data and a
 * standardised error-reporting function
 */

// Escape post data 
foreach($_POST as $key => $post)
	if($key != 'req')
		$_POST[$key] = escape($post);

// Escape get data
foreach($_GET as $key => $get)
	$_GET[$key] = escape($get);

/**
 * Escapes the string inputted
 * 
 * @param	string	$v		the string to be escaped
 * 
 * @return	the escaped string
 */
function escape($v){
	// Replace newline tokens with <br />
	$linefeeds = array("\r\n", "\n", "\r");
	$v = str_replace($linefeeds,'<br/>', $v);
	
	// Replace disallowed html tags with a 'disallowed' tag
	$disallowedTags = array('<html', '<body', 
							'<DOCTYPE', '<title', '<link', '<meta', '<style', 
							'<form', '<input', '<textarea', '<select', 
							'<option', '<optgroup', '<button', '<label', 
							'<fieldset', '<legend', 
							'<script', '<noscript');
	$disallowedClosingTags = array('</html', '</body', 
									'</DOCTYPE', '</title', '</link', '</meta', '</style', 
									'</form', '</input', '</textarea', '</select', 
									'</option', '</optgroup', '</button', '</label', 
									'</fieldset', '</legend', 
									'</script', '</noscript');
	$v = str_replace($disallowedTags, '<disallowed', $v);
	$v = str_replace($disallowedClosingTags, '</disallowed', $v);
	
	// Clean html entities
	$out = htmlentities($v, ENT_QUOTES, 'UTF-8', false);
	
	return $out;
}

/**
 * Unescapes the string inputted
 * 
 * @param	string	$v		the string to be unescaped
 * 
 * @return	the unescaped string
 */
function unescape($v){
	$v = str_replace('&quot;', '\"', $v);
	$v = str_replace('&#039;', '\\\'', $v);
	$out = html_entity_decode($v, ENT_QUOTES, 'UTF-8');
	
	return $out;
}

/**
 * Finds out if all of the keys in keys can be found as
 * keys in array, and sends an appropriate error message
 * if not
 * 
 * @param	array	$keys	an array of keys which should be
 * 							found in the other array
 * @param	array	$array	the array to check for the existence
 * 							of the keys
 * 
 * @returns			true if keys aren't found in array, calls 
 * 					sendError with error message otherwise
 */
function badKeys($keys, $array){
	$errorMessage = '';
	
	if($array){
		$badKeys = array();
		
		foreach($keys as $key)
			if(!array_key_exists($key, $array))
				$badKeys[] = $key;
			else if(!is_array($array[$key]) && strlen(trim($array[$key])) == 0)
				$badKeys[] = $key;
		
		foreach($badKeys as $badKey)
			$errorMessage .= $badKey.' cannot be blank<br />';
	}
	else{
		$errorMessage = 'Array not found<br />';
	}
	
	if(strlen($errorMessage))
		sendError($errorMessage);
	
	return true;
}

/**
 * Sends an error message to the front end
 * 
 * @param	string		$errorMessage		an error message to be displayed
 */
function sendError($errorMessage){
	echo '{"success": false, "errors": [], "errorMessage": "'.$errorMessage.'"}';
	exit;
}
