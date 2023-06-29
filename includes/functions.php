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
  $img_ref = 'images/helpers/' . preg_replace('/\s+/', '', $helper['name']) . '.png';

  if (!file_exists($img_ref)) {
    $img_ref = 'images/helpers/' . preg_replace('/\s+/', '', $helper['name']) . '.gif';
  }

  echo '<li>';
  echo '<button id="' . $name . '"  onclick="buy_helper(\'' . $name . '\')">';
  echo '<img src="' . $img_ref . '" alt="' . $name . '">';
  echo '<p>' . $name . ", " . $cps . " cps" . '</p>';
  echo '<p>' . $cost . " sussies" . '</p>';
  echo '</button>';
  echo '<li>';  

  if (!$helper['bought']) {
    return true;
  } else {
    return false;
  }
}

?>