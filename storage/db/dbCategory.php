<?php

require_once('dbClassLoader.php');

/**
 * Class for the database table 'category'
 */
class dbCategory extends dbBase{
	
	public function dbCategory(){
		parent::__construct();
	}
	
	/**
	 * Creates a new category under a given parent
	 * 
	 * @param	int		$owner_id		the id of the user making the category
	 * @param	int		$parent_id		the id of the parent category
	 * @param	string	$name			the name of the category
	 * @param	string	$status			the category's creation status
	 * 
	 * @return	int		the new category's id
	 */
	public function create($owner_id, $parent_id, $name, $status = null){
		$sql = "INSERT INTO category(owner_id, parent_id, name) ".
				"VALUES($owner_id, $parent_id, '$name')";
		$this->db->query($sql);
		
		$id = $this->getID($owner_id, $parent_id, $name);
		parent::create($id, 'category', $status);
		
		$cat = $this->read($owner_id, $id);
		$_SESSION['catKids'][$parent_id][$id] = $cat;
		
		return $id;
	}
	
	/**
	 * Makes a new category tree
	 * 
	 * @param	int		$owner_id		the user's id
	 * 
	 * @return	int		the id of the root of the newly created tree
	 */
	public function makeNewTree($owner_id){
		$sql = "INSERT INTO category(owner_id, parent_id, name) ".
				"VALUES($owner_id, 0, 'All')";
		$this->db->query($sql);
		
		$id = $this->getID($owner_id, 0, 'All');
		parent::create($id, 'category', null);
		
		return $id;
	}
	
	/**
	 * Gets the categories belonging to a particular user
	 * 
	 * @param	int		$owner_id	the user whose categories we want
	 * 
	 * @return	array	all the categories belonging to this user
	 */
	public function getCategories($owner_id){
		$dbCard = new dbCard();
		
		$sql = "SELECT c.id, c.name, c.parent_id ".
				"FROM category c, base b ".
				"WHERE c.id = b.foreign_id ".
					"AND c.owner_id = $owner_id ".
					"AND b.foreign_table = 'category' ".
					"AND b.status != 'deleted' ".
				"ORDER BY c.name ASC";
		$cats = $this->db->query($sql);
		$outs = array();
		
		foreach($cats as $cat){
			$out = array();
			$out['id'] = $cat['id'];
			$out['text'] = $cat['name'];
			$out['num'] = $dbCard->getCount($_SESSION['owner_id'], $cat['id']);
			$outs[$out['id']] = $out;
		}
		
		return $outs;
	}
	
	/**
	 * Gets all the child categories of the given category.
	 * Uses the "Fast" methods in dbCard to fetch total counts and review counts
	 * 
	 * @param	int		$owner_id		the id of the user
	 * @param	int		$id				the id of the category
	 * @param	bool	$getCounts		true to get the number of cards in
	 * 									the category
	 * @param	bool	$getRev			true to get the number of cards ready
	 * 									for review in the category
	 * 
	 * @return array	all the child categories of the given category
	 */	
	public function getChildrenFast($owner_id, $id, $getCounts = false, $getRevs = false){
		if(!is_array($_SESSION['catKids'][$id])){
			$_SESSION['catKids'] = array();
			
			$dbCard = new dbCard();
			
			$sql = "SELECT c.id as id, c.name as name, c.name as text, 'folder' as cls ".
					"FROM category c, base b ".
					"WHERE c.parent_id = $id ".
						"AND c.owner_id = $owner_id ".
						"AND c.id = b.foreign_id ".
						"AND b.foreign_table = 'category' ".
						"AND b.status != 'deleted' ".
					"ORDER BY c.name ASC";
			$children = $this->db->query($sql);
			
			foreach($children as $child){
				if($getCounts)
					$child['num'] = $dbCard->getCountFast($owner_id, $child['id']);
				
				if($getRevs)
					$child['rev'] = $dbCard->getReviewsFast($owner_id, $child['id']);
				
				$_SESSION['catKids'][$id][$child['id']] = $child;
			}
		}
		
		return $_SESSION['catKids'][$id];
	}
	
	/**
	 * Gets all the child categories of the given category
	 * 
	 * @depricated		use getChildrenFast() instead
	 * 
	 * @param	int		$owner_id		the id of the user
	 * @param	int		$id				the id of the category
	 * @param	bool	$getCount		true to get the number of cards in
	 * 									the category
	 * @param	bool	$getRev			true to get the number of cards ready
	 * 									for review in the category
	 * 
	 * @return	array	all the child categories of the given category
	 */
	public function getChildren($owner_id, $id, $getCount = false, $getRev = false){
		if(!is_array($_SESSION['catKids']))
			$_SESSION['catKids'] = array();
			
		$dbCard = new dbCard();
		$children = array();
		
		if(!is_array($_SESSION['catKids'][$id])){
			$sql = "SELECT c.id, c.name ".
					"FROM category c, base b ".
					"WHERE c.parent_id = $id ".
						"AND c.owner_id = $owner_id ".
						"AND c.id = b.foreign_id ".
						"AND b.foreign_table = 'category' ".
						"AND b.status != 'deleted' ".
					"ORDER BY c.name ASC";
			$children = $this->db->query($sql);
			
			foreach($children as $child)
				$_SESSION['catKids'][$id][$child['id']] = $child;
		}
		else
			$children = $_SESSION['catKids'][$id];
		
		$nodes = array();
		
		foreach($children as $child){
			$node = array();
			$node['text'] = $child['name'];
			$node['name'] = $child['name'];
			$node['cls'] = 'folder';
			$node['id'] = $child['id'];
			if($getCount)
				$node['num'] = $dbCard->getCount($owner_id, $child['id'], $getCount);
			if($getRev)
				$node['rev'] = $dbCard->getReviewCount($owner_id, $child['id'], $getRev);
			$nodes[$node['id']] = $node;
		}
		
		return $nodes;
	}
	
	/**
	 * Gets the id of a category based on the name and parent id
	 * 
	 * @param	int		$owner_id		the user's id
	 * @param	int		$parent_id		the parent category id
	 * @param	string	$name			the name of the category
	 * 
	 * @return	int		the id of the category
	 */
	private function getID($owner_id, $parent_id, $name){
		$sql = "SELECT c.id " .
				"FROM category c, base b ".
				"WHERE c.owner_id = $owner_id ".
					"AND c.parent_id = $parent_id ".
					"AND c.name = '$name' ".
				"ORDER BY c.id DESC ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		
		return $ret[0]['id'];
	}
	
	/**
	 * Reads a category from the database, based on the category id
	 * 
	 * @param	int		$owner_id	the user's id
	 * @param	int		$id			the category id
	 * 
	 * @return	array	the category data
	 */
	public function read($owner_id, $id){
		$sql = "SELECT c.id, c.owner_id, ".
				"c.parent_id, c.name, ".
				"b.created, b.modified, b.status ".
				"FROM category c, base b ".
				"WHERE c.id = '$id' ".
					"AND c.owner_id = $owner_id ".
					"AND c.id = b.foreign_id ".
					"AND b.foreign_table = 'category' ".
					"AND b.status != 'deleted' ".
				"LIMIT 1";
		
		$ret = $this->db->query($sql);
		return $ret[0];
	}
	
	/**
	 * Updates a given category with the given information.
	 * Does NOT apply status updates recursively (but should!)
	 * 
	 * @todo Apply status updates recursively!
	 * 
	 * @param	int		$id				the category id
	 * @param	int		$owner_id		the user id
	 * @param	int		$parent_id		the (new) parent id
	 * @param	string	$name			the (new) category name
	 * @param	string	$status			the (new) status
	 */
	public function update($id, $owner_id, $parent_id, $name, $status = null){
		$ret = $this->read($owner_id, $id);
		$sql = "UPDATE category ".
				"SET parent_id = $parent_id, name = '$name' ".
				"WHERE id = $id ".
					"AND owner_id = $owner_id";
		$this->db->query($sql);
		
		if($status)
			$this->updateWithForeignKeys($id, 'category', $status);
		
		if($status == 'deleted' || $ret['parent_id'] != $parent_id)
			unset($_SESSION['catKids']);
		
		if($ret['parent_id'] != $parent_id) {
			$numberOfCardsInCategory = $_SESSION['cardCounts'][$id];
			$numberUpForReviewInCategory = $_SESSION['reviewCounts'][$id];
			$hasParent = true;
			$id = $ret['parent_id'];
		
			if($id == 0)
				$hasParent = false;
			
			while($hasParent){
				$category = $this->read($owner_id, $id);
				$_SESSION['cardCounts'][$id] -= $numberOfCardsInCategory;
				$_SESSION['reviewCounts'][$id] -= $numberUpForReviewInCategory;
				
				$id = $category['parent_id'];
				
				if($id == 0)
					$hasParent = false;
			}
		}
	}
	
	/**
	 * Updates the status of the category to 'deleted', and applies
	 * this status recursively to all child categories
	 * 
	 * @param	int		$owner_id	the user's id
	 * @param	int		$id			the category id
	 */
	public function delete($owner_id, $id){
		$ret = $this->read($owner_id, $id);
		
		$dbCard = new dbCard();
		$cards = $dbCard->getCards($owner_id, $id);
		
		foreach($cards as $card)
			$dbCard->delete($owner_id, $card['id']);
		
		$children = $this->getChildren($owner_id, $id);
		
		foreach($children as $child)
			$this->delete($owner_id, $child['id']);
			
		$this->update($id, $owner_id, $ret['parent_id'], $ret['name'], 'deleted');
	}
	
	public function __destruct(){
		parent::__destruct();
	}
}
