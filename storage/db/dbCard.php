<?php

require_once('dbClassLoader.php');

/**
 * Class for the database table 'card'
 */
class dbCard extends dbBase{
	
	public function dbCard(){
		parent::__construct();
	}
	
	/**
	 * Increments the review and card count for a given category
	 * (for example, when a new card is created)
	 * 
	 * @param	int		$owner_id		the owner of the category
	 * @param	int		$category_id		the category to decrement
	 */
	private function incrementCounts($owner_id, $category_id) {
		$dbCat = new dbCategory();
		$hasParent = true;
		
		if($category_id == 0)
			$hasParent = false;
		
		while($hasParent){
			$category = $dbCat->read($owner_id, $category_id);
			$_SESSION['cardCounts'][$category['id']] += 1;
			$_SESSION['reviewCounts'][$category['id']] += 1;
			
			$category_id = $category['parent_id'];
			
			if($category_id == 0)
				$hasParent = false;
		}
	}
	
	/**
	 * Decrements the review count for a given category (for example
	 * when a card is successfully reviewed, or deleted)
	 * 
	 * @param	int		$owner_id		the owner of the category
	 * @param	int		$category_id		the category to decrement
	 */
	private function decrementReviewCounts($owner_id, $id, $category_id) {
		$reviewCards = $this->getReviewCards($owner_id, $category_id);
		$isReviewCard = false;
		
		foreach($reviewCards as $reviewCard)
			if($reviewCard['id'] == $id) {
				$isReviewCard = true;
				break;
			}
		
		if($isReviewCard) {
			$dbCat = new dbCategory();
			$hasParent = true;
			
			if($category_id == 0)
				$hasParent = false;
			
			while($hasParent){
				$category = $dbCat->read($owner_id, $category_id);
				$_SESSION['reviewCounts'][$category['id']] -= 1;
				
				$category_id = $category['parent_id'];
				
				if($category_id == 0)
					$hasParent = false;
			}
		}
	}
	
	/**
	 * Decrements the card count for a given category (for example
	 * when a card is deleted)
	 * 
	 * @param	int		$owner_id		the owner of the category
	 * @param	int		$category_id		the category to decrement
	 */
	private function decrementCardCounts($owner_id, $category_id) {
		$dbCat = new dbCategory();
		$hasParent = true;
		
		if($category_id == 0)
			$hasParent = false;
		
		while($hasParent){
			$category = $dbCat->read($owner_id, $category_id);
			$_SESSION['cardCounts'][$category['id']] -= 1;
			
			$category_id = $category['parent_id'];
			
			if($category_id == 0)
				$hasParent = false;
		}
	}
	
	/**
	 * Convenient function during testing/debugging.
	 * Resets the three different 'count' arrays.
	 */
	private function resetCounts(){
		unset($_SESSION['catKids']);
		unset($_SESSION['cardCounts']);
		unset($_SESSION['reviewCounts']);
	}
	
	/**
	 * Creates a new card in a given category
	 * 
	 * @param	int		$owner_id		the owner of the card
	 * @param	int		$category_id		the category the card will be in
	 * @param	string	$question		the card's question
	 * @param	string	$answer			the card's answer
	 * @param	sting	$hint			the hint - not in use
	 * @param	string	$status			the card's creation status
	 * 
	 * @return	int		the card's id
	 */
	public function create($owner_id, $category_id, $question,
							$answer, $hint, $status = null){
		$sql = "INSERT INTO card(owner_id, category_id, question, " .
									"answer, hint, next_test) ".
				"VALUES($owner_id, $category_id, '$question', '$answer', '$hint', now())";
		$this->db->query($sql);
		
		$this->incrementCounts($owner_id, $category_id);
		
		$id = $this->getID($owner_id, $question, $answer);
		parent::create($id, 'card', $status);
		
		return $id;
	}
	
	/**
	 * Gets all the cards in a given category
	 * 
	 * @param	int		$owner_id		the owner of the category (sanity check)
	 * @param	int		$category_id		the category id of the
	 * 
	 * @return	array|bool		all the cards in this category, or false if none 
	 */
	public function getCards($owner_id, $category_id){
		$sql = "SELECT c.id, c.owner_id, c.category_id, c.question, c.answer, ".
				"c.hint, c.last_test, c.next_test, c.total_test, c.tests_passed, ".
				"b.created, b.modified, b.status ".
				"FROM card c, base b ".
				"WHERE c.category_id = $category_id ".
					"AND c.owner_id = $owner_id ".
					"AND c.id = b.foreign_id ".
					"AND b.foreign_table = 'card' ".
					"AND b.status != 'deleted' ".
				"ORDER BY c.next_test ASC, id";
		$cards = $this->db->query($sql);
		
		if(is_array($cards))
			foreach($cards as $k => $card){
				if($card['total_test'] > 0)
					$card['pass_rate'] = $card['tests_passed']/$card['total_test'];
				else
					$card['pass_rate'] = 0.0;
				
				$cards[$k] = $card;
			}
		
		return $cards;
	}
	
	/**
	 * Find a card id based on the question and answer on the card
	 * 
	 * @param	string	$question		the question on the card
	 * @param	int		$owner_id		the owner of the card (sanity check)
	 * @param	string	$answer			the answer on the card
	 * 
	 * @return	int		the card's id
	 */
	private function getID($owner_id, $question, $answer){
		$sql = "SELECT id FROM card " .
				"WHERE owner_id = '$owner_id' ".
					"AND question = '$question' ".
					"AND answer = '$answer' ".
				"ORDER BY id DESC ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		$ret = $ret[0]['id'];
		
		return $ret;
	}
	
	/**
	 * Gets the number of cards in a given category which are ready for review
	 * 
	 * @param	int		$owner_id		the id of the user who owns the category (sanity check)
	 * @param	int		$category_id		the id of the category to be reviewed
	 * 
	 * @return 	int 	the number of cards ready for review in the given category
	 */
	public function getReviewsFast($owner_id, $category_id){
		if(!is_array($_SESSION['reviewCounts'])){
			$_SESSION['reviewCounts'] = array();
			
			$sql = "SELECT COUNT(c.id) as count, t.id as id, t.parent_id as parent_id, " .
					"t.name as name, t.name as text, 'folder' as cls " .
					"FROM card c, category t, base b, base b2 " .
					"WHERE c.next_test < now() " .
						"AND c.owner_id = $owner_id " .
						"AND c.category_id = t.id " .
						"AND c.id = b.foreign_id " .
						"AND b.foreign_table = 'card' " .
						"AND b.status != 'deleted' " .
						"AND t.id = b2.foreign_id " .
						"AND b2.foreign_table = 'category' " .
						"AND b2.status != 'deleted' " .
						"GROUP BY c.category_id";
			
			$counts = $this->db->query($sql);
			
			foreach($counts as $count)
				$_SESSION['reviewCounts'][$count['id']] = $count['count'];
		}
		
		if(!isset($_SESSION['reviewCounts'][$category_id])){
			$_SESSION['reviewCounts'][$category_id] = 0;
			
			$sql = "SELECT c.id " .
					"FROM category c, base b " .
					"WHERE c.owner_id = $owner_id " .
						"AND c.id = b.foreign_id " .
						"AND b.foreign_table =  'category' " .
						"AND b.status != 'deleted' " .
						"AND c.parent_id = $category_id " .
					"ORDER BY c.parent_id";
			
			$cats = $this->db->query($sql);
			
			foreach($cats as $cat)
				$_SESSION['reviewCounts'][$category_id] += $this->getReviewsFast($owner_id, $cat['id']);
		}
		
		return $_SESSION['reviewCounts'][$category_id];
	}
	
	/**
	 * Gets the number of cards in a given category
	 * 
	 * @param	int		$owner_id		the id of the user who owns the category (sanity check)
	 * @param	int		$category_id		the id of the category
	 * 
	 * @return 	int 	the total number of cards in the given category
	 */
	public function getCountFast($owner_id, $category_id){
		if(!is_array($_SESSION['cardCounts'])){
			$_SESSION['cardCounts'] = array();
			
			$sql = "SELECT COUNT(c.id) as count, t.id as id, t.parent_id as parent_id, " .
					"t.name as name, t.name as text, 'folder' as cls " .
					"FROM card c, category t, base b, base b2 " .
					"WHERE c.owner_id = $owner_id " .
						"AND c.category_id = t.id " .
						"AND c.id = b.foreign_id " .
						"AND b.foreign_table = 'card' " .
						"AND b.status != 'deleted' " .
						"AND t.id = b2.foreign_id " .
						"AND b2.foreign_table = 'category' " .
						"AND b2.status != 'deleted' " .
						"GROUP BY c.category_id";
			
			$counts = $this->db->query($sql);
			
			foreach($counts as $count)
				$_SESSION['cardCounts'][$count['id']] = $count['count'];
		}
		
		if(!isset($_SESSION['cardCounts'][$category_id])){
			$_SESSION['cardCounts'][$category_id] = 0;
			
			$sql = "SELECT c.id " .
					"FROM category c, base b " .
					"WHERE c.owner_id = $owner_id " .
						"AND c.id = b.foreign_id " .
						"AND b.foreign_table =  'category' " .
						"AND b.status != 'deleted' " .
						"AND c.parent_id = $category_id " .
					"ORDER BY c.parent_id";
			
			$cats = $this->db->query($sql);
			
			foreach($cats as $cat)
				$_SESSION['cardCounts'][$category_id] += $this->getCountFast($owner_id, $cat['id']);
		}
		
		return $_SESSION['cardCounts'][$category_id];
	}
	
	/**
	 * Gets the number of cards in a given category
	 * 
	 * @deprecated				use getCountFast() instead
	 * 
	 * @param	int		$owner_id		the id of the user who owns the category (sanity check)
	 * @param	int		$category_id		the id of the category
	 * @param	bool	$getCount		true to recursively get card counts
	 * 
	 * @return 	int 	the number of cards ready for review in the given category
	 */
	public function getCount($owner_id, $category_id, $getCount = false){
		// set up the cache
		if(!is_array($_SESSION['cardCounts']))
			$_SESSION['cardCounts'] = array();
		
		$ret = 0;
		
		// if the count isn't in the cache already
		if(empty($_SESSION['cardCounts'][$category_id])){
			// get the count from the database
			$sql = "SELECT COUNT(c.id) as count " .
					"FROM card c, base b " .
					"WHERE c.owner_id = $owner_id ".
						"AND c.category_id = $category_id " .
						"AND c.id = b.foreign_id " .
						"AND b.foreign_table = 'card' " .
						"AND b.status != 'deleted'";
			
			$ret = $this->db->query($sql);
			$ret = $ret[0]['count'];
			
			$dbCat = new dbCategory();
			$children = $dbCat->getChildren($owner_id, $category_id, $getCount, false);
			
			if(is_array($children))
				foreach($children as $child)
					$ret += $child['num'];
			
			$_SESSION['cardCounts'][$category_id] = $ret;
		}
		else
			// get the count from the cache
			$ret = $_SESSION['cardCounts'][$category_id];
		
		return $ret;
	}
	
	/**
	 * Gets the number of cards in a given category which are ready for review
	 * 
	 * @deprecated				use getReviewsFast() instead
	 * 
	 * @param	int		$owner_id		the id of the user who owns the category (sanity check)
	 * @param	int		$category_id		the id of the category to be reviewed
	 * @param	bool	$getRev			true to recursively get review counts
	 * 
	 * @return 	int 	the number of cards ready for review in the given category
	 */
	public function getReviewCount($owner_id, $category_id, $getRev = false){
		// set up the cache
		if(!is_array($_SESSION['reviewCounts']))
			$_SESSION['reviewCounts'] = array();
		
		$ret = 0;
		
		// if the count isn't in the cache already
		if(empty($_SESSION['reviewCounts'][$category_id])){
			// get the count from the database
			$sql = "SELECT COUNT(c.id) as count ".
				   "FROM card c, base b ".
				   "WHERE c.next_test < now() ".
				   		"AND c.category_id = $category_id ".
				   		"AND c.owner_id = $owner_id ".
				   		"AND c.id = b.foreign_id ".
				   		"AND b.foreign_table = 'card' ".
				   		"AND b.status != 'deleted' ";
			
			$ret = $this->db->query($sql);
			$ret = $ret[0]['count'];
			
			$dbCat = new dbCategory();
			$children = $dbCat->getChildren($owner_id, $category_id, false, $getRev);
			
			if(is_array($children))
				foreach($children as $child)
					$ret += $child['rev'];
			
			$_SESSION['reviewCounts'][$category_id] = $ret;
		}
		else
			// get the count from the cache
			$ret = $_SESSION['reviewCounts'][$category_id];
		
		return $ret;
	}
	
	/**
	 * Gets all the cards in a given category which are ready for review
	 * 
	 * @param	int		$owner_id		the id of the user who owns the card (sanity check)
	 * @param	int		$category_id		the id of the category to be reviewed
	 * @param	string	$subcategories	'on' to include subcategories - not in use
	 * 
	 * @return 	array|bool	all the cards in the given category which are ready for review, 
	 * 						or false if none.
	 */
	public function getReviewCards($owner_id, $category_id, $subcategories = null){
		$categories = $category_id;
		
		// get sub categories
		if($subcategories != null && $subcategories == 'on'){
			$dbCat = new dbCategory();
			$categories = array();
			$unseenCategories = array();
			
			$categories[] = $category_id;
			
			while($category_id != null){
				$temp = $dbCat->getChildren($owner_id, $category_id);
				foreach($temp as $t){
					$categories[] = $t;
					$unseenCategories[] = $t;
				}
				$category_id = array_shift($unseenCategories);
				$category_id = $category_id['id'];
			}
			
			$cat_ids = array();
			
			foreach($categories as $c)
				$cat_ids[] = $c['id'];
			
			$categories = implode(',', $cat_ids);
		}
		
		// get review cards
		$sql = "SELECT c.id, c.question, c.answer, ct.name ".
			   "FROM card c, category ct, base b ".
			   "WHERE c.next_test < now() ".
			   		"AND c.category_id IN ($categories) ".
			   		"AND c.owner_id = $owner_id ".
			   		"AND ct.id = c.category_id ".
			   		"AND c.id = b.foreign_id ".
			   		"AND b.foreign_table = 'card' ".
			   		"AND b.status != 'deleted' ".
			   	"ORDER BY (c.tests_passed/c.total_test) DESC, id ";
		
		$cards = $this->db->query($sql);
		return $cards;
	}
	
	/**
	 * Reads and returns a card from the database
	 * 
	 * @param	int		$id				the id of the card to be read
	 * @param	int		$owner_id		the id of the user who owns the card (sanity check)
	 * 
	 * @return 	array 	the card data
	 */
	public function read($owner_id, $id){
		$sql = "SELECT c.id, c.owner_id, c.category_id, c.question, c.answer, ".
				"c.hint, c.deck, c.last_test, c.next_test, c.total_test, c.tests_passed, ".
				"b.created, b.modified, b.status ".
				"FROM card c, base b ".
				"WHERE c.id = $id ".
					"AND c.owner_id = $owner_id ".
					"AND c.id = b.foreign_id ".
					"AND b.foreign_table = 'card' ".
					"AND b.status != 'deleted' ".
				"LIMIT 1";
		$ret = $this->db->query($sql);
		return $ret[0];
	}
	
	/**
	 * Updates the card and the appropriate counts
	 * 
	 * @param	int		$owner_id		the id of the user who owns the card (sanity check)
	 * @param	int		$id				the id of the card to be updated
	 * @param	int		$category_id		the id of the (new) category the card belongs to
	 * @param	string	$question		the (new) question
	 * @param	string	$answer			the (new) answer
	 * @param	string	$hint			the (new) hint - not in use
	 * @param	int		$deck			the (new) deck the card is in
	 * @param	string	$last_test		the (new) date of the last test
	 * @param	string	$next_test		the (new) date of the next test
	 * @param	int		$total_test		the (new) total number of times the card has been tested
	 * @param	int		$tests_passed	the (new) total number of passed
	 * @param	string	$status			the card's (new) status
	 */
	public function update($id, $owner_id, $category_id, $question,
							$answer, $hint, $deck, $last_test, $next_test,
							$total_test, $tests_passed, $status = null){
		if($deck > 0)
			$this->decrementReviewCounts($owner_id, $id, $category_id);
			
		$ret = $this->read($owner_id, $id);
		if($ret['category_id'] != $category_id) {
			$this->decrementCardCounts($owner_id, $ret['category_id']);
			$this->incrementCounts($owner_id, $category_id);
			$this->decrementReviewCounts($owner_id, $id, $ret['category_id']);
		}
		
		$sql = "UPDATE card ".
				"SET category_id = $category_id, ".
				"question = '$question', answer = '$answer', ".
				"hint = '$hint', deck = $deck, last_test = '$last_test', next_test = '$next_test', ".
				"total_test = $total_test, tests_passed = $tests_passed ".
				"WHERE id = $id ".
					"AND owner_id = $owner_id";
		$this->db->query($sql);
		$this->updateWithForeignKeys($id, 'card', $status);
	}
	
	/**
	 * Changes a card's status to deleted, and decrements the appropriate
	 * counts
	 * 
	 * @param	int		$owner_id		the id of the user who owns the card (sanity check)
	 * @param	int		$id				the id of the card to be deleted
	 */
	public function delete($owner_id, $id){
		$ret = $this->read($owner_id, $id);
		$this->decrementCardCounts($owner_id, $ret['category_id']);
		$this->decrementReviewCounts($owner_id, $id, $ret['category_id']);
		
		$this->update($id, $owner_id, $ret['category_id'],
						$ret['question'], $ret['answer'], $ret['hint'], $ret['deck'],
						$ret['last_test'], $ret['next_test'],
						$ret['total_test'], $ret['tests_passed'], 'deleted');
	}
		
	public function __destruct(){
		parent::__destruct();
	}
}
