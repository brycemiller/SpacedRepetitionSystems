-- phpMyAdmin SQL Dump
-- version 2.11.6
-- http://www.phpmyadmin.net
--
-- Vert: localhost
-- Generert den: 05. Apr, 2014 klokka 11:14 AM
-- Tjenerversjon: 5.0.51
-- PHP-Versjon: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `srs`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `base`
--

CREATE TABLE `base` (
  `id` double unsigned NOT NULL auto_increment,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `foreign_id` double unsigned NOT NULL,
  `foreign_table` varchar(128) collate utf8_unicode_ci NOT NULL,
  `status` enum('deleted','active','suspended','flagged','pending') collate utf8_unicode_ci NOT NULL default 'pending',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `foreign_id` (`foreign_id`,`foreign_table`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7276 ;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `card`
--

CREATE TABLE `card` (
  `id` double unsigned NOT NULL auto_increment,
  `owner_id` double unsigned NOT NULL,
  `category_id` double unsigned NOT NULL,
  `question` varchar(1024) collate utf8_unicode_ci NOT NULL,
  `answer` varchar(1024) collate utf8_unicode_ci NOT NULL,
  `hint` varchar(1024) collate utf8_unicode_ci NOT NULL,
  `deck` double unsigned NOT NULL default '0',
  `last_test` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `next_test` timestamp NOT NULL default '0000-00-00 00:00:00',
  `total_test` double NOT NULL default '0',
  `tests_passed` double NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6453 ;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `category`
--

CREATE TABLE `category` (
  `id` double unsigned NOT NULL auto_increment,
  `owner_id` double unsigned NOT NULL,
  `parent_id` double unsigned NOT NULL default '0',
  `name` varchar(128) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=823 ;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `user`
--

CREATE TABLE `user` (
  `id` double unsigned NOT NULL auto_increment,
  `username` varchar(126) collate utf8_unicode_ci NOT NULL,
  `password` varchar(126) collate utf8_unicode_ci NOT NULL,
  `role` set('pupil','teacher','parent','admin','srsadmin') collate utf8_unicode_ci NOT NULL default 'pupil',
  `last_login` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;
