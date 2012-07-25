<?php

/**
* Backend class
*/
class Backend {

    protected $_db;
    protected $_translations;

    public function __construct($user="root", $pass="", $host="localhost", $db="rteditable", $table="translations") {

        $this->_db = mysql_connect($host, $user, $pass);
        mysql_select_db($db);

        // Reset?
        if(isset($_REQUEST["reset"])) {
            $sql = "DELETE FROM translations;";
            mysql_query($sql);
            $sql = "INSERT INTO `translations` (`id`, `slug`, `translation`) VALUES (1,'title','The world of editing<br>'),(2,'maindesc','<b>rtEditable</b> is an awesome jquery extension that allows you to edit Text in your browser view!<br><b>Check it out: </b>simply hover over anything, click once, and start editing!<br>'),(3,'readmore','Read more »'),(4,'heading1','First Heading'),(5,'heading2','Second Heading'),(6,'text1','Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. '),(7,'text2','Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. By the way, did you know that you can use <b>keyboard shortcuts like [cmd+b]</b> to format text?<br>'),(8,'copyright','&copy; Company 2012'),(9,'learnmore','Learn more &raquo;'),(10,'home','Home'),(11,'about','About'),(12,'contact','Contact'),(13,'youarehere','You are here');";
            mysql_query($sql);
            header( 'Location: index.php' ) ;
            exit();
        }

        // load translations
        $sql = 'SELECT * FROM translations';
        $result = mysql_query($sql);
        while ($row = mysql_fetch_assoc($result)) {
            $this->_translations[$row["slug"]] = $row["translation"];
        }

        // Check for translate request
        if(isset($_REQUEST["rteditable"]) && $_REQUEST["rteditable"] == "true") {
            $slug = $_REQUEST["slug"];
            $html = $_REQUEST["html"];

            // Prevent sql injections
            $html = str_replace("'", '\\\'', $html);

            $sql = "UPDATE translations SET translation = '$html' WHERE slug = '$slug';";
            mysql_query($sql);
            die("success");
        }
    }

    public function __($slug) {
        return $this->_translations[$slug];
    }

}


?>