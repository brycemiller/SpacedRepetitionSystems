<?php

define('CH', 'hi88E74WiFHsYjuOJSpztIYPmGYb553KYO95wbHj');

/**
 * Class for aiding the implementation of a challenge-handshake
 * authentication protocol for protecting against replay attacks
 * 
 */
class chap{
	
	/**
	 * Creats a new chap object, clearing the session and reseting the challenge
	 * 
	 * @param	bool	$clearSession 	true to reset the session/challenge
	 */
	public function chap($clearSession = false){
		if($clearSession)
			$this->clearSession();
		
		session_start();
	}
	
	/**
	 * Removes the challenge and destroys the session
	 */
	public function clearSession(){
		session_start();
		unset($_SESSION[CH.'Passed']);
		session_unset();
		session_destroy();
	}
	
	/**
	 * Instantiates the challenge values
	 * 
	 * @param	string		$challenge		the challenge token
	 */
	public function setChallenge($challenge = CH){
		$_SESSION[$challenge] = $this->getNewKey();
		$_SESSION[$challenge.'Passed'] = false;
	}
	
	/**
	 * @param	string		$challenge		the challenge token
	 * 
	 * @return	string		the random challenge key
	 */
	public function getChallenge($challenge = CH){
		return $_SESSION[$challenge];
	}
	
	/**
	 * Removes the challenge key from the session
	 * 
	 * @param	string		$challenge		the challenge token
	 */
	public function removeChallenge($challenge = CH){
		unset($_SESSION[$challenge]);
	}
	
	/**
	 * Marks that the user has passed the challenge
	 * 
	 * @param	string		$challenge		the challenge token
	 */
	public function setPassed($challenge = CH){
		$_SESSION[$challenge.'Passed'] = true;
	}
	
	/**
	 * Returns true if the user has passed the given challenge token
	 * 
	 * @param	string		$challenge		the challenge token
	 * 
	 * @return	bool		true is passed, false the otherwise
	 */
	public function getPassed($challenge = CH){
		return $_SESSION[$challenge.'Passed'];
	}
	
	/**
	 * Generates a new random challenge key
	 * 
	 * @param	length		optional, default 40
	 * 						the number of characters in the challenge key
	 * 
	 * @return	A new string key of the length specified
	 */
	private function getNewKey($length = 40){
		$chars = 'abcdefghijklmnopqrstuvwxyz'.
					'ABCDEFGHIJKLMNOPQRSTYVWXYZ0'.
					'123456789';
		$m = strlen($chars)-1;
		$key = '';
		
		for($i = 0; $i < $length; $i++)
			$key .= substr($chars, rand(0,$m), 1);
		
		return $key;
	}
}
