-- phpMyAdmin SQL Dump
-- version 4.3.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 20, 2015 at 08:57 PM
-- Server version: 10.0.15-MariaDB
-- PHP Version: 5.6.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sensorLogger`
--

-- --------------------------------------------------------

--
-- Table structure for table `datatable`
--

CREATE TABLE IF NOT EXISTS `datatable` (
  `userid` int(11) NOT NULL,
  `sensorid` int(11) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `datavalue` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sensortable`
--

CREATE TABLE IF NOT EXISTS `sensortable` (
  `sensorid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `unit` text NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sensortable`
--

INSERT INTO `sensortable` (`sensorid`, `userid`, `unit`, `name`) VALUES
(1, 1, '°C', 'Temperature');

-- --------------------------------------------------------

--
-- Table structure for table `usertable`
--

CREATE TABLE IF NOT EXISTS `usertable` (
  `userid` int(11) NOT NULL,
  `login` text NOT NULL,
  `mdp` text NOT NULL,
  `seed` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usertable`
--

INSERT INTO `usertable` (`userid`, `login`, `mdp`, `seed`) VALUES
(1, 'test', '1622833c9f2cade2317cd53267d53439', 'foreinqs2135FDZEVdkazidj');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `datatable`
--
ALTER TABLE `datatable`
  ADD PRIMARY KEY (`userid`,`sensorid`,`timestamp`), ADD UNIQUE KEY `userid_3` (`userid`,`sensorid`), ADD UNIQUE KEY `userid_4` (`userid`,`sensorid`,`timestamp`), ADD KEY `userid` (`userid`), ADD KEY `sensorid` (`sensorid`), ADD KEY `userid_2` (`userid`,`sensorid`);

--
-- Indexes for table `sensortable`
--
ALTER TABLE `sensortable`
  ADD PRIMARY KEY (`sensorid`,`userid`), ADD UNIQUE KEY `sensorid_2` (`sensorid`,`userid`), ADD KEY `sensorid` (`sensorid`,`userid`), ADD KEY `sensorid_3` (`sensorid`,`userid`);

--
-- Indexes for table `usertable`
--
ALTER TABLE `usertable`
  ADD PRIMARY KEY (`userid`), ADD UNIQUE KEY `userid` (`userid`), ADD UNIQUE KEY `userid_2` (`userid`), ADD KEY `userid_3` (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sensortable`
--
ALTER TABLE `sensortable`
  MODIFY `sensorid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `usertable`
--
ALTER TABLE `usertable`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
