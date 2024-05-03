SET NAMES utf8;

CREATE DATABASE IF NOT EXISTS `dbbooks`;

USE `dbbooks`;

DROP TABLE IF EXISTS `books`;

CREATE TABLE IF NOT EXISTS `books` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capa` varchar(255) NOT NULL,
    `titulo` varchar(255) NOT NULL,
    `autor` varchar(255) NOT NULL,
    `editora` varchar(255) NOT NULL,
    `ano` varchar(4) NOT NULL,
    `isbn` varchar(13) NOT NULL,
    `idioma` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;