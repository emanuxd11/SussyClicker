<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];

  $json_file = '../content/helpers.json';
  $json_data = file_get_contents($json_file);
  $helpers = json_decode($json_data, true);

  $index = array_search($name, array_column($helpers, 'name'));

  $helpers["$index"]['bought'] = true;
  $helpers["$index"]['quantity'] += 1;

  $updated_json = json_encode($helpers, JSON_PRETTY_PRINT);
  file_put_contents($json_file, $updated_json);


  $response = array(
    'status' => 'success',
    'message' => 'Helper information updated successfully.'
  );
  echo json_encode($response);
}
?>