<?php
  require_once 'includes/functions.php';
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Sussy Clicker</title>
    <link rel="icon" type="image/x-icon" href="images/favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="javascript/script.js" defer></script>
  </head>

  <body>
    <h1>Sussy Clicker</h1>
    <button id="sussyButton"><img src="images/sussy.png" alt="amogus"></button>
    <p id="score">Sussy Meter: 0</p>

    <div>
      <h2>Sussy Helpers</h2>
      <?php
        $helpers = getHelpers();
        foreach ($helpers as $helper) {
          displayHelper($helper);
        }
      ?>
      
    </div>
  </body>
</html>
