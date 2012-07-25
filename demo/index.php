<?php require_once("Backend.php"); ?>
<?php $backend = new Backend("root", file_get_contents("password.txt")); ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo str_replace("<br>", "", $backend->__("title")); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- rteditable src -->
    <link rel="stylesheet" href="../src/jquery.rteditable.css" type="text/css" media="screen">

    <link href="css/bootstrap.css" rel="stylesheet">
    <style type="text/css">
        body {
            padding-top: 60px;
            padding-bottom: 40px;
        }
    </style>
  </head>

  <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#" data-slug="title"><?php echo $backend->__("title"); ?></a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active"><a href="#" data-rtgroup="home" data-slug="home"><?php echo $backend->__("home"); ?></a></li>
              <li><a href="#about" data-slug="about"><?php echo $backend->__("about"); ?></a></li>
              <li><a href="#contact" data-slug="contact"><?php echo $backend->__("contact"); ?></a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">

      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
        <h1 data-slug="title"><?php echo $backend->__("title"); ?></h1>
        <p data-slug="maindesc"><?php echo $backend->__("maindesc"); ?></p>
        <p><a class="btn btn-primary btn-large" data-slug="learnmore"><?php echo $backend->__("learnmore"); ?></a></p>
      </div>

      <ul class="breadcrumb">
          <li><span data-slug="youarehere"><?php echo $backend->__("youarehere"); ?></span>: <span data-slug="home"><?php echo $backend->__("home"); ?></span></li>
      </ul>

      <!-- Example row of columns -->
      <div class="row">
        <div class="span4">
          <h2 data-slug="title"><?php echo $backend->__("title"); ?></h2>
           <p data-slug="maindesc"><?php echo $backend->__("maindesc"); ?></p>
          <p><a class="btn" data-slug="readmore" href="#"><?php echo $backend->__("readmore"); ?></a></p>
        </div>
        <div class="span4">
          <h2 data-slug="heading1"><?php echo $backend->__("heading1"); ?></h2>
           <p data-slug="text1"><?php echo $backend->__("text1"); ?></p>
          <p><a class="btn" data-slug="readmore" href="#"><?php echo $backend->__("readmore"); ?></a></p>
       </div>
        <div class="span4">
          <h2 data-slug="heading2"><?php echo $backend->__("heading2"); ?></h2>
          <p data-slug="text2"><?php echo $backend->__("text2"); ?></p>
          <p><a class="btn" data-slug="readmore" href="#"><?php echo $backend->__("readmore"); ?></a></p>
        </div>
      </div>

      <hr>

      <footer>
        <p data-slug="copyright"><?php echo $backend->__("copyright"); ?></p>
        <p class="well" data-slug="title"><?php echo $backend->__("title"); ?></p>
        <p><a href="index.php?reset" class="btn btn-danger btn-large">Reset all translations</a></p>
      </footer>

    </div>

    <script src="js/jquery.js"></script>
    <script src="js/bootstrap-transition.js"></script>
    <script src="js/bootstrap-alert.js"></script>
    <script src="js/bootstrap-modal.js"></script>
    <script src="js/bootstrap-dropdown.js"></script>
    <script src="js/bootstrap-scrollspy.js"></script>
    <script src="js/bootstrap-tab.js"></script>
    <script src="js/bootstrap-tooltip.js"></script>
    <script src="js/bootstrap-popover.js"></script>
    <script src="js/bootstrap-button.js"></script>
    <script src="js/bootstrap-collapse.js"></script>
    <script src="js/bootstrap-carousel.js"></script>
    <script src="js/bootstrap-typeahead.js"></script>

    <!-- rteditable src -->
    <script src="../src/jquery.rteditable.js"></script>
    <script type="text/javascript" charset="utf-8">
        $().ready(function() {
            $('[data-slug]').rteditable({
                url: "index.php?post=true"
            });
        });
    </script>

  </body>
</html>
