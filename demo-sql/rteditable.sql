DROP TABLE IF EXISTS `translations`;
CREATE TABLE `translations` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) DEFAULT '',
    `translation` text,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;