<?php

require_once('dbClassLoader.php');

/**
 * Class for the database table 'user'
 */
class dbUser extends dbBase{
	
	public function dbUser(){
		parent::__construct();
	}
	
	/**
	 * Creates a new user
	 * 
	 * @param	string	$username	the user's username (usually an email address)
	 * @param	string	$password	the user's password
	 * @param	string	$role		the role the of the user (pupil/teacher/etc)
	 * @param	string	$status		the creation status of the user
	 * 
	 * @return	int		the new user's id
	 */
	public function create($username, $password,
							$role = null, $status = null){
		if($role == null) $role = 'pupil';
		$password = md5($password);
		$sql = "INSERT INTO user(username, password, role) ".
				"VALUES('$username', '$password', '$role')";
		$this->db->query($sql);
		
		$id = $this->getID($username);
		parent::create($id, 'user', $status);
		
		// make a new category tree for the user to use
		$dbCat = new dbCategory();
		$dbCat->makeNewTree($id);
		
		return $id;
	}
	
	/**
	 * Returns the id of a user, based on his username
	 * 
	 * @param	string	$username	the user's username
	 * 
	 * @return	int		the user's id
	 */
	private function getID($username){
		$sql = "SELECT id FROM user WHERE username = '$username' ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		$ret = $ret[0]['id'];
		
		return $ret;
	}
	
	/**
	 * Reads a user from the database, based on the given username.
	 * 
	 * Probably better to use getID(username) and read(id) than have
	 * MORE sql.
	 * 
	 * @param	string		$username	the user's username
	 * 
	 * @return	array		the user details
	 */
	public function readWithUsername($username){
		$sql = "SELECT u.id, u.username, u.password, u.role, u.last_login, ".
				"b.created, b.modified, b.status ".
				"FROM user u, base b ".
				"WHERE username = '$username' ".
					"AND u.id = b.foreign_id ".
					"AND b.foreign_table = 'user' ".
					"AND b.status != 'deleted' ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		return $ret[0];
	}
	
	/**
	 * Reads a user from the database, based on the given id.
	 * 
	 * @param	int		$id		the user's id
	 * 
	 * @return	array 	the user details
	 */
	public function read($id){
		$sql = "SELECT u.id, u.username, u.password, u.role, u.last_login, ".
				"b.created, b.modified, b.status ".
				"FROM user u, base b ".
				"WHERE u.id = $id ".
					"AND u.id = b.foreign_id ".
					"AND b.foreign_table = 'user' ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		return $ret[0];
	}
	
	/**
	 * "logs in" a user (i.e., updates last login date)
	 * 
	 * @param	int		$id		the id of the user to login
	 */
	public function login($id){
		$sql = "UPDATE user SET last_login = now() WHERE id = $id";
		$this->db->query($sql);
	}
	
	/**
	 * Updates a user with the given information
	 * 
	 * @param	int		$id				the user id
	 * @param	string	$username		the user's username
	 * @param	string	$password		the user's (new) password
	 * @param	string	$role			the (new) role of the user
	 * @param	string	$status			the (new) status for the user
	 */
	public function update($id, $username, $password,
							$role = null, $status = null){
		if($role == null) $role = 'pupil';
		$sql = "REPLACE INTO user(id, username, password, role) ".
				"VALUES($id, '$username', '$password', '$role')";
		$this->db->query($sql);
		$this->updateWithForeignKeys($id, 'user', $status);
	}
	
	/**
	 * Changes the status of this user to deleted.
	 * 
	 * @param	int		$id		the id of the user to delete
	 */
	public function delete($id){
		$ret = $this->read($id);
		
		$this->update($id, $ret['username'], $ret['password'],
						$ret['role'], 'deleted');
	}
	
	public function __destruct(){
		parent::__destruct();
	}
}
