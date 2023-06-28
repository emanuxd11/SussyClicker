<?php

function getHelpers() {
  // Read the contents of the JSON file
  $jsonData = file_get_contents('content/helpers.json');

  // Parse the JSON data into an associative array
  $helpers = json_decode($jsonData, true);

  // Access the helper data
  if ($helpers !== null) {
    // foreach ($helpers['helpers'] as $helper) {
    //   $name = $helper['name'];
    //   $cookiesPerSecond = $helper['cookiesPerSecond'];
    //   $cost = $helper['cost'];

    //   // Perform any desired operations with the helper data
    //   // For example, you can echo the data to display it on the webpage
    //   // echo "Name: $name, Cookies Per Second: $cookiesPerSecond, Cost: $cost<br>";
    // }
  } else {
    echo "Error parsing JSON data";
  }

  // var_dump($helpers);

  return $helpers;
}

function displayHelper($helper) {
  $name = $helper['name'];
  $cps = $helper['cps'];
  $cost = $helper['cost'];
  $img_ref = preg_replace('/\s+/', '', $helper['name']) . ".png";

  // add condition to only show cost and submit to buy.php if bought === false

  echo '<button id="' . $name . '">';
  echo '<img src="../images/' . $img_ref . '" alt="' . $name . '">';
  echo '<p>' . $name . ", " . $cps . " cps" . '</p>';
  echo '</button>';

  if (!$helper['bought']) {
    // testing
    echo 'not bought'; 
  }
}

?>