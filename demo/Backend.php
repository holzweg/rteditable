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