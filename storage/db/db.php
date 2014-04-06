<?php

/**
 * This class nices the running of SQL queries so that the other
 * classes don't need to tackle making and breaking database 
 * connections.
 */
class db{
	
	/** @var	string 	database hostname */
	private $host = /*'srslearning.db'*/'localhost:3306';
	/** @var 	string	database user's username */
	private $username = 'SRSMaster';
	/** @var 	string	database user's password */
	private $password = 'fa5OVnderlK0LEmvnpkyeckuN8Ab3MPWtfhD08DB';
	/** @var 	string	name of the database to connect to */
	private $database = 'srs';
	/** @var 	int		database connection */
	private $connection = null;
	
	/**
	 * Instanciates a new db object
	 * 
	 * @param	string	$host		the database hostname
	 * @param	string	$username	the username of the database user we're using
	 * @param	string	$password	the password of the database user we're using
	 * @param	string	$database	the name of the database to connect to
	 */
	public function __construct($host = null, 
								$username = null, $password = null,
								$database = null){
		if(isset($host))
			$this->host = $host;
		if(isset($username))
			$this->username = $username;
		if(isset($password))
			$this->password = $password;
		if(isset($database))
			$this->database = $database;
	}
	
	/**
	 * Sometimes, connections are autmotically dropped by MySQL.
	 * This function refreshes the connection by attempting to connect again.
	 */
	private function refreshConnection(){
		// make a new connection and prime it
		$this->connection = mysql_connect($this->host, $this->username, $this->password);
		mysql_select_db($this->database, $this->connection);
		mysql_query("SET NAMES 'utf8'");
		mysql_query("SET CHARACTER SET 'utf8'");
	}
	
	/**
	 * Runs an sql query and nices the output to arrays/
	 * booleans
	 * 
	 * @param	string	$sql		an sql query
	 * 
	 * @return	array|bool	an array of any and all results or boolean false if
	 * 						there are none
	 */
	public function query($sql){
		$this->refreshConnection();
		$result = mysql_query($sql, $this->connection);
		if(mysql_error($this->connection)){
			echo $sql, '<br />';
			echo mysql_error($this->connection), '<br />';
		}
		$row = null;
		$ret = array();
		
		if(is_resource($result))
			while($row = mysql_fetch_array($result))
				$ret[] = $row;
		else if(is_bool($result))
			$ret = $result;
		
		return $ret;
	}
	
	/**
	 * Relinquish connect to database on destruction
	 */
	public function __destruct(){
		// close the connection
		@mysql_close($this->connection);
	}
}
