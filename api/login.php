<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user = $_POST['user'];
  $pass = $_POST['pass'];
  
  try {

    $sql = "SELECT * FROM userinfo WHERE BINARY username = ? AND password = ?";
    $st = $conn->prepare($sql);
    $st->bind_param('ss', $user, $pass);


    $st->execute();


    $result = $st->get_result();

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $userid = $row['userid'];
      $response = [
        "status" => "success",
        "message" => "Login successful",
        "userid" => $userid
      ];
    } else {
      $response = [
        "status" => "error",
        "message" => "Invalid username or password"
      ];
    }

    $st->close();

  } catch (Exception $e) {

    $response = [
      "status" => "error",
      "message" => "An error occurred: " . $e->getMessage()
    ];
  }

  echo json_encode($response);

} else {
  $response = [
    "status" => "error",
    "message" => "Invalid request method"
  ];
  echo json_encode($response);
}
?>
