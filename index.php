<?php
  require_once 'includes/functions.php';
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Sussy Clicker</title>
    <link rel="icon" type="image/x-icon" href="images/misc/favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="javascript/script.js" defer></script>
    <script src="javascript/ajax.js" defer></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  </head>

  <body>
    <h1>Sussy Clicker</h1>
    <button id="sussyButton"><img src="images/misc/sussy.png" alt="amogus"></button>
    <p id="score">Sussy Meter: 0</p>
    <p id="cps">Total CPS: 0</p>

    <section id="helpers">
      <h2>Sussyficationers</h2>

      <ul id="helper-list">
      <?php
        $helpers = getHelpers();
        $stop = false;
        foreach ($helpers as $helper) {
          if ($stop !== false) {
            displayHelper($helper);
            $stop = false;
            break;
          }
          $stop = displayHelper($helper);
        }
      ?>
      </ul>
    </section>
  </body>
</html>
