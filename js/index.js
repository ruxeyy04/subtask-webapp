$(document).ready(function () {
  var userId = userid;

  $("#tasktable").DataTable({
    ajax: {
      url: url + "api/alltask.php",
      type: "GET",
      data: {
        userid: userId
      },
      dataSrc: "data",
    },
    columns: [
      { data: "task_id" },
      { data: "name" },
      { data: "desc" },
      {
        data: "datetime",
        render: function (data, type, row) {
          if (data) {
            let date = new Date(data);

            let formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            let formattedTime = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
            });
            return `<span>${formattedDate}</span><span class="note"> ${formattedTime}</span>`;
          } else {
            return ""; // Return an empty string if datetime is not available
          }
        }
      },
      {
        data: "status",
        render: function (data, type, row) {
          let badgeColor = '';
          let button = '';
          if (data === 'Pending') {
            badgeColor = 'bg-info';
          } else if (data === 'Ongoing') {
            badgeColor = 'bg-warning';
          } else if (data === 'Complete') {
            badgeColor = 'bg-success';
          }
          return `<span class="badge ${badgeColor}">${data}</span>`;
        }
      },
    ],
    language: {
      emptyTable: "No Task Yet" 
    },
  });

  $.ajax({
    type: "GET",
    url: url + "api/alltask.php",
    data: {userid: userid},
    dataType: "json",
    success: function (response) {
      $('#total_task').text(response.totalTasks)
      $('#pending_task').text(response.pendingCount)
      $('#ongoing_task').text(response.ongoingCount)
      $('#completed_task').text(response.completedCount)
    }
  });
})
