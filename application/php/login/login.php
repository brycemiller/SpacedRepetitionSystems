<?php

require_once(dirname(__FILE__).'/../../../storage/db/dbClassLoader.php');
include_once(dirname(__FILE__).'/../../../libs/php/chap/chap.php');
include_once(dirname(__FILE__).'/../session/sessionTracking.php');
include_once(dirname(__FILE__).'/../security/securityFilter.php');

// prime the response with a new challenge
$chap = new chap();
$response = array('message' => 'Incorrect method name or no method name provided', 'chap' => $chap->getChallenge());

// if the rpc has been posted, update response with return from login function
if(sizeof($_POST)){
	$req = str_replace('\\', '', $_POST['req']);
	$request = json_decode($req, true);
	$method = $request['method'];
	$params = $request['params'];
	
	if($method == 'login')
		$response = login($params['username'], $params['password']);
}

// send response to the front end
echo json_encode($response);

/**
 * Authenticates the user
 * 
 * @param string	$username		the username of the user logging in	
 * @param string	$password		the password, md5 chap encrypted
 * 
 * @return	array	an array signalling success on success, error message on failure
 */
function login($username, $password){
	// make new chap and user abstraction
	$chap = new chap();
	$dbUser = new dbUser();
	
	// get user's details
	$row = $dbUser->readWithUsername($username);
	
	// if the username exists in the database
	if(sizeof($row))
		// if the password is correct for this challenge
		if($password == md5($row['password'].$chap->getChallenge())){
			// update chap and last login
			$chap->setPassed();
			$dbUser->login($row['id']);
			
			// prime session with user details
			$_SESSION['username'] = $username;
			$_SESSION['owner_id'] = $row['id'];
			
			// return success
			return array('success' => 'success');
		}
	
	// get new challenge
	$chap = new chap(true);
	$chap->setChallenge();
	
	// return failure
	return array('message' => 'Your username or password is incorrect', 'chap' => $chap->getChallenge());
}
