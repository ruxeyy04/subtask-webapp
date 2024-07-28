<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
date_default_timezone_set('Asia/Manila');
$currentTime = date('Y-m-d H:i:s');
include 'config.php';
$task = array();
if (isset($_GET['userid']) && isset($_GET['searchval']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $userid = $_GET['userid'];
  $searchval = "%" . $_GET['searchval'] . "%"; // Add % for SQL wildcard search

  $sql = "SELECT * FROM task WHERE userid = ? AND (name LIKE ? OR description LIKE ?)";
  $st = $conn->prepare($sql);
  $st->bind_param('iss', $userid, $searchval, $searchval);
  $st->execute();
  $result = $st->get_result();

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $task['task'][] = $row;
    }
  }

  echo json_encode($task);
  exit;
}

if (isset($_GET['userid']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $userid = $_GET['userid'];

  $sql = "SELECT * FROM task WHERE userid = ?";
  $st = $conn->prepare($sql);
  $st->bind_param('i', $userid);
  $st->execute();
  $result = $st->get_result();

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $task['task'][] = $row;
    }
  }

  echo json_encode($task);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['viewtask']) && isset($_GET['task_id'])) {
  $task_id = $_GET["task_id"];
  $conn->begin_transaction();
  try {
    $sql = "SELECT * FROM task WHERE task_id = $task_id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
        $response = $row;
      }
    } else {
      $response['msg'] = "no such task";
    }

    $conn->commit();
  } catch (Exception $e) {
    $conn->rollback();
    $response['msg'] = $e->getMessage();
  }

  echo json_encode($response);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
  $task_id = $_POST['task_id'];
  $name = $_POST['taskname'];
  $description = $_POST['desc'];

  $conn->begin_transaction();
  try {
    $sql = $conn->prepare("UPDATE task SET name = ?, description = ? WHERE task_id = ?");
    $sql->bind_param('sss', $name, $description, $task_id);
  
    if ($sql->execute()) {
      $response = [
        "status" => "success",
        "message" => "Task Edited Successfully"
      ];
    } else {
      $response = [
        "status" => "error",
        "message" => "Failed to edit task information"
      ];
    }

    $conn->commit();
  } catch (Exception $e) {
    $response = [
      "status" => "error",
      "message" => "An error occurred: " . $e->getMessage()
    ];
  }

  echo json_encode($response);
  exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deleteTask'])) {
  $taskid = $_POST['task_id'];
  try {
    $sql = "DELETE FROM task WHERE task_id = ?";
    $st = $conn->prepare($sql);


    $st->bind_param('i', $taskid);
  

    if ($st->execute()) {

      $response = [
        "status" => "success",
        "message" => "Task Deleted Successfully"
      ];
    } else {

      $response = [
        "status" => "error",
        "message" => "Failed to delete task"
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
  exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['dotheTask'])) {
  $taskid = $_POST['task_id'];
  try {
    $sql = "UPDATE task SET status = 'Ongoing' WHERE task_id = ?";
    $st = $conn->prepare($sql);


    $st->bind_param('i', $taskid);
  

    if ($st->execute()) {

      $response = [
        "status" => "success",
        "message" => "Task is updated to ongoing Successfully"
      ];
    } else {

      $response = [
        "status" => "error",
        "message" => "Failed to change task"
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
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['completeTask'])) {
  $taskid = $_POST['task_id'];
  try {
    $sql = "UPDATE task SET status = 'Complete' WHERE task_id = ?";
    $st = $conn->prepare($sql);


    $st->bind_param('i', $taskid);
  

    if ($st->execute()) {

      $response = [
        "status" => "success",
        "message" => "Task is updated to complete"
      ];
    } else {

      $response = [
        "status" => "error",
        "message" => "Failed to complete task"
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
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $task = $_POST['taskname'];
  $desc = $_POST['desc'];
  $userid = $_POST['userid'];
  try {
    $getLatestUserIdSql = "SELECT MAX(task_id) AS latest_id FROM task";
    $result = $conn->query($getLatestUserIdSql);
    
    if ($result && $result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $latestid = $row['latest_id'];
      

      $taskid = $latestid + 1;
    } else {
   
      $taskid = 1;
    }
    $sql = "INSERT INTO task(`task_id`, `userid`, `name`, `description`, `datetime`) VALUES (?, ?, ?, ?, ?)";
    $st = $conn->prepare($sql);


    $st->bind_param('iisss', $taskid, $userid, $task, $desc, $currentTime);
  

    if ($st->execute()) {

      $response = [
        "status" => "success",
        "message" => "Task Added Successfully"
      ];
    } else {

      $response = [
        "status" => "error",
        "message" => "Failed to add task information"
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

}
