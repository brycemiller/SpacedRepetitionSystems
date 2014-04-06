<?php

	$start = microtime();
	
	$lesson = file_get_contents('kana.xml');
	
	$doc = DOMDocument::loadXML($lesson);
	$el = $doc->documentElement;
	$data = traverse($el);
	file_put_contents('kana.txt', $data);
	
	$end = microtime();
	echo 'Took ', ($end-$start), 's';
	
	function traverse($currentNode, $depth = '', $first = true){
		$data = '';
		$nl = "\r\n";
		if($first)
			$nl = '';
		
		if($currentNode->nodeName == 'Card')
			if($currentNode->hasAttribute('Frontside') && $currentNode->hasAttribute('Backside'))
				$data .= $nl.'"'.$currentNode->getAttribute('Frontside').'";"'.$currentNode->getAttribute('Backside').'"';
		
		if($currentNode->nodeName == 'Category')
			if($currentNode->hasAttribute('name')){
				$data .= $nl.$depth.$currentNode->getAttribute('name');
				$first = false;
				$depth .= '+';
			}
		
		if($currentNode->hasChildNodes())
			foreach($currentNode->childNodes as $childNode)
				$data .= traverse($childNode, $depth, $first);
		
		return $data;
	}
?>
