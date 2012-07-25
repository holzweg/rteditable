DROP TABLE IF EXISTS `translations`;
CREATE TABLE `translations` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) DEFAULT '',
    `translation` text,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `translations` WRITE;

INSERT INTO `translations` (`id`, `slug`, `translation`)
VALUES
	(1,'title','The w\'\'orld of editing<br>'),
	(2,'maindesc','<b>rtEditable</b> is an awesome jquery extension that allows you to edit Text in your browser view!<br><b>Check it out: </b>simply hover over anything, click once, and start editing!<br>'),
	(3,'readmore','Read more Â»'),
	(4,'heading1','First Heading'),
	(5,'heading2','Second Heading'),
	(6,'text1','Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. '),
	(7,'text2','Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. By the way, did you know that you can use <b>keyboard shortcuts like [cmd+b]</b> to format text?<br>'),
	(8,'copyright','&copy; Company 2012'),
	(9,'learnmore','Learn more &raquo;'),
	(10,'home','Home'),
	(11,'about','About'),
	(12,'contact','Contact'),
	(13,'youarehere','You are here');
UNLOCK TABLES;
