<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
date_default_timezone_set('Asia/Manila');
$currentTime = date('Y-m-d H:i:s');
include 'config.php';

if (isset($_GET['userid']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $userid = $_GET['userid'];
  $task = array();
  // Initialize counters for different status values
  $totalTasks = 0;
  $pendingCount = 0;
  $ongoingCount = 0;
  $completedCount = 0;

  $sql = "SELECT * FROM task WHERE userid = ?";
  $st = $conn->prepare($sql);
  $st->bind_param('i', $userid);
  $st->execute();
  $result = $st->get_result();

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $taskid = $row['task_id'];
      $name = $row['name'];
      $desc = $row['description'];
      $stat = $row['status'];
      $datetime = $row['datetime'];

      // Increment the total tasks counter
      $totalTasks++;

      // Update status-specific counters
      if ($stat === 'Pending') {
        $pendingCount++;
      } elseif ($stat === 'Ongoing') {
        $ongoingCount++;
      } elseif ($stat === 'Complete') {
        $completedCount++;
      }

      $task[] = array(
        "task_id" => $taskid,
        "name" => $name,
        "desc" => $desc,
        "status" => $stat,
        "datetime" => $datetime
      );
    }
  } else {
    $response = array('status'=>'error', 'message'=>'not found');
}

  // Create an array to hold task data and counters
  $response = array(
    'data' => $task,
    'totalTasks' => $totalTasks,
    'pendingCount' => $pendingCount,
    'ongoingCount' => $ongoingCount,
    'completedCount' => $completedCount
  );

  echo json_encode($response);
}
?>
