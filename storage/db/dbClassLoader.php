<?php

/**
 * Magic function for autoloading db-classes as and when they are
 * required.
 * 
 * @param	string	$class	the name of the class to be loaded
 */
function __autoload($class)
{
	require_once(dirname(__FILE__)."/$class.php");
}