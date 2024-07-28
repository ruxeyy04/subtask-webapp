<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
date_default_timezone_set('Asia/Manila');
$currentTime = date('Y-m-d H:i:s');
include 'config.php';


if ($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['userid'])) {
  $userid = $_GET['userid'];

  $sql = "SELECT * FROM userinfo WHERE userid = ?";
  $st = $conn->prepare($sql);

  $st->bind_param('i', $userid);

  $st->execute();

  $result = $st->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $userid = $row['userid'];
    $fname = $row['fname'];
    $lname = $row['lname'];
    $email = $row['email'];
    $username = $row['username'];
    $password = $row['password'];

    $userinfo[] = array(
      "userid" => $userid,
      "fname" => $fname,
      "lname" => $lname,
      "email" => $email,
      "user" => $username,
      "pass" => $password
    );

    echo json_encode($userinfo);
  } else {
    $response = array('status' => 'error', 'message' => 'not found');
  }
}

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_POST['userid']) && isset($_POST['update'])) {
  $userid = $_POST['userid'];
  $fname = $_POST['fname'];
  $lname = $_POST['lname'];
  $email = $_POST['email'];
  $username = $_POST['user'];

  $sql = "UPDATE userinfo SET fname = ?, lname = ?, username = ?, email = ? WHERE userid = ?";
  $st = $conn->prepare($sql);

  $st->bind_param("ssssi", $fname, $lname, $username, $email, $userid);

  if ($st->execute()) {
    if ($st->affected_rows > 0) {
      echo json_encode(array('status' => "success", 'message' => 'Updated Successfully'));
    } else {
      echo json_encode(array('status' => "info", 'message' => 'No changes were made'));
    }
  } else {
    // SQL execution failed
    echo json_encode(array('status' => "error", 'message' => 'Update Failed'));
  }
}

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_POST['userid']) && isset($_POST['changepass'])) {
  $userid = $_POST['userid'];
  $oldpass = $_POST['oldpass'];
  $newpass = $_POST['newpass'];

  $sql = "SELECT password FROM userinfo WHERE userid = ?";
  $st = $conn->prepare($sql);
  $st->bind_param("i", $userid);
  $st->execute();
  $result = $st->get_result();

  if ($result->num_rows == 1) {
    // User exists, check the old password
    $row = $result->fetch_assoc();
    $storedPassword = $row['password'];

    if ($oldpass == $storedPassword) {
      $updateSql = "UPDATE userinfo SET password = ? WHERE userid = ?";
      $updateSt = $conn->prepare($updateSql);
      $updateSt->bind_param("si", $newpass, $userid);

      if ($updateSt->execute()) {
        echo json_encode(array('status' => "success", 'message' => 'Password Updated Successfully'));
      } else {
        echo json_encode(array('status' => "error", 'message' => 'Password Update Failed'));
      }
    } else {
      echo json_encode(array('status' => "error", 'message' => 'Old Password Incorrect'));
    }
  } else {
    echo json_encode(array('status' => "error", 'message' => 'User not found'));
  }
}
