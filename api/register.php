<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $fname = $_POST['fname'];
  $lname = $_POST['lname'];
  $email = $_POST['email'];
  $user = $_POST['username'];
  $pass = $_POST['password'];

  try {
    $getLatestUserIdSql = "SELECT MAX(userid) AS latest_userid FROM userinfo";
    $result = $conn->query($getLatestUserIdSql);
    
    if ($result && $result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $latestUserId = $row['latest_userid'];
      

      $userid = $latestUserId + 1;
    } else {
   
      $userid = 1;
    }
    $sql = "INSERT INTO userinfo(`userid`, `fname`, `lname`, `username`, `password`, `email`) VALUES (?, ?, ?, ?, ?, ?)";
    $st = $conn->prepare($sql);


    $st->bind_param('isssss', $userid, $fname, $lname, $user, $pass, $email);
  

    if ($st->execute()) {

      $response = [
        "status" => "success",
        "message" => "User information added successfully"
      ];
    } else {

      $response = [
        "status" => "error",
        "message" => "Failed to add user information"
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
