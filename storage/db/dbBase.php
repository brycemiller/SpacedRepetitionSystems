<?php

require_once('dbClassLoader.php');

/**
 * Class for the database table 'base'
 * 
 * Includes fields that are common to all entities in the database.
 */
class dbBase{
	
	/** @var 	db		A database connection */
	protected $db;
	
	/**
	 * Instanciates a new dbBase object
	 */
	public function __construct(){
		// Create a new connection for this object to use
		$this->db = new db();
	}
	
	/**
	 * Creates a new item in the base table
	 * 
	 * @param	int		$foreign_id		the item's id in the foreign table
	 * @param	string	$foreign_table	the name of the foreign table
	 * @param	string	$status			the status of this item at creation
	 */
	protected function create($foreign_id, $foreign_table, $status = null){
		if($status == null) $status = 'pending';
		$sql = "INSERT INTO base(created, foreign_id, foreign_table, status) ".
				"VALUES(now(), $foreign_id, '$foreign_table', '$status')";
		$this->db->query($sql);
	}
	
	/**
	 * Updates an item with a new status in the base table.
	 * 
	 * @param	int		$foreign_id		the item's id in the foreign table
	 * @param	string	$foreign_table	the name of the foreign table
	 * @param	string	$status			the status of this item at creation
	 */
	protected function updateWithForeignKeys($foreign_id, $foreign_table, $status = ''){
		$sql = "UPDATE base ".
				"SET status = '$status' ".
				"WHERE foreign_id = $foreign_id AND foreign_table = '$foreign_table'";
		$this->db->query($sql);
	}
	
	/**
	 * Updates an item with a new status in the base table.
	 * 
	 * @param	int		$id			the item's local id
	 * @param	string	$status		the status of this item at creation
	 */
	protected function updateWithID($id, $status = null){
		$sql = "UPDATE base ".
				"SET status = '$status' ".
				"WHERE id = $id";
		$this->db->query($sql);
	}
	
	/**
	 * Sets an item's status to deleted
	 * 
	 * @param	int		$id		the item's local id
	 */
	protected function deleteWithID($id){
		$this->updateWithID($id, 'deleted');
	}
	
	/**
	 * Sets an item's status to deleted
	 * 
	 * @param	int		$foreign_id		the item's id in the foreign table
	 * @param	string	$foreign_table	the name of the foreign table
	 */
	protected function deleteWithForeignKeys($foreign_id, $foreign_table){
		$this->updateWithForeignKeys($foreign_id, $foreign_table, 'deleted');
	}
	
	/**
	 * Ensure internal database object relinquishes connection on destruction
	 */
	public function __destruct(){
		$this->db->__destruct();
	}
}
