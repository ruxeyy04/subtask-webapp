$('#taskadd').submit(function (e) {
  e.preventDefault();
  var formdata = new FormData(this)
  formdata.append('userid', userid);
  $.ajax({
    type: "POST",
    url: url + "api/task.php",
    data: formdata,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {
      Swal.fire({
        title: 'Success!',
        text: 'Task Added Successfully',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(function () {
        $('#addtask').modal('hide');
      })
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    },
    complete: function () {
      displaytask();
      pagination();
    }
  });
})

displaytask()
function displaytask() {
  $.ajax({
    type: "GET",
    url: url + "api/task.php",
    data: { userid: userid },
    dataType: "json",
    success: function (res) {
      console.log(res);

      // Initialize HTML content for each section
      let pendingTasksHTML = '';
      let ongoingTasksHTML = '';
      let completedTasksHTML = '';
      let allTasksHTML = '';

      $.each(res.task, function (ind, val) {
        let date = new Date(val.datetime);

        let formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        let formattedTime = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        });

        // Determine badge color and section based on status
        let badgeColor = '';
        let button = '';
        if (val.status === 'Pending') {
          badgeColor = 'bg-info';
          button =
            `<div class="d-flex flex-wrap justify-content-center">
              <a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}">View</a> 
              <a class="btn-sm app-btn-secondary edit_task" href="#" data-editid="${val.task_id}" ><i class="fa-solid fa-pen-to-square"></i></a>
              <a class="btn-sm app-btn-secondary delete_task" href="#" data-trashid="${val.task_id}"><i class="fa-solid fa-trash"></i></a>
              <a class="btn-sm app-btn-secondary do_now" href="#" data-donowid="${val.task_id}"><i class="fa-solid fa-check"></i> Do Now</a></div>`
        } else if (val.status === 'Ongoing') {
          badgeColor = 'bg-warning';
          button = `<div class="d-flex flex-wrap justify-content-center"><a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}" >View</a>
            <a class="btn-sm app-btn-secondary done_task" href="#" data-donetaskid="${val.task_id}"><i class="fa-solid fa-check-double"></i> Done</a></div>`
        } else if (val.status === 'Complete') {
          badgeColor = 'bg-success';
          button = `<div class="d-flex flex-wrap justify-content-center"><a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}" >View</a></div>`
        }

        // Create the task row HTML
        let taskRow = `<tr>
          <td class="cell">#${val.task_id}</td>
          <td class="cell"><span class="truncate">${val.name}</span></td>
          <td class="cell">${val.description}</td>
          <td class="cell"><span>${formattedDate}</span><span class="note">${formattedTime}</span></td>
          <td class="cell"><span class="badge ${badgeColor}">${val.status}</span></td>
          <td class="cell">${button}</td>
        </tr>`;

        // Add the task row HTML to the appropriate section variable
        if (val.status === 'Pending') {
          pendingTasksHTML += taskRow;
        } else if (val.status === 'Ongoing') {
          ongoingTasksHTML += taskRow;
        } else if (val.status === 'Complete') {
          completedTasksHTML += taskRow;
        }
        
        // Add the task row HTML to the 'allTasksHTML' variable
        allTasksHTML += taskRow;
      });

      // Set the HTML content of each section
      $('#pending-taskk').html(pendingTasksHTML);
      $('#ongoing-task').html(ongoingTasksHTML);
      $('#completed-task').html(completedTasksHTML);
      $('#all-task').html(allTasksHTML);
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    },
  });
}


$(document).on('click', '.delete_task', function() {
  var task_id = $(this).attr("data-trashid");
  
  Swal.fire({
    title: 'Confirm Delete',
    text: 'Are you sure you want to delete this task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, perform the delete action
      deleteTask(task_id);
    }
  });
});

$(document).on('click', '.do_now', function () {
  let taskid = $(this).attr('data-donowid')
  console.log(taskid)
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to do the task now?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No, maybe later',
  }).then((result) => {
    if (result.isConfirmed) {
      donowtask(taskid);
    }
  });
})
function deleteTask(task_id) {

  $.ajax({
    type: "POST", 
    url: url + "api/task.php",
    data: { deleteTask: true, task_id: task_id },
    dataType: "json",
    success: function (response) {

      Swal.fire({
        title: 'Deleted!',
        text: 'The task has been deleted.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(function () {
      });
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);

      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while deleting the task.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    },
    complete: function () {
      displaytask();
      pagination();
    }
  });
}
function donowtask(task_id) {

  $.ajax({
    type: "POST", 
    url: url + "api/task.php",
    data: { dotheTask: true, task_id: task_id },
    dataType: "json",
    success: function (response) {

      Swal.fire({
        title: 'Ongoing!',
        text: 'The task has been ongoing.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(function () {
        location.reload();
      });
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);

      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while changing the task.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    },
    complete: function () {
      displaytask();
      pagination();
    }
  });
}
function donetask(task_id) {

  $.ajax({
    type: "POST", 
    url: url + "api/task.php",
    data: { completeTask: true, task_id: task_id },
    dataType: "json",
    success: function (response) {

      Swal.fire({
        title: 'Complete!',
        text: 'The task has been complete.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(function () {
        location.reload();
      });
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);

      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while completing the task.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    },
    complete: function () {
      displaytask();
      pagination();
    }
  });
}
$(document).on('click', '.view_task', function () {
  task_id = $(this).attr('data-viewid')
  $.ajax({
    type: "GET",
    url: url + "api/task.php",
    data: { viewtask: true, task_id: task_id },
    dataType: "json",
    success: function (response) {
      let date = new Date(response.datetime);

      let formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      let formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });
      $('#task_id').html(response.task_id)
      $('#task_name').html(response.name)
      $('#description').html(response.description)
      $('#date_created').html(`<span>${formattedDate}</span><span class="note"> ${formattedTime}</span>`)
      $('#status').html(response.status)
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log('Error:', textStatus, errorThrown)
      console.log('Response: ', xhr.responseText)
    },
    complete: function() {
      $('#viewtask').modal('show')
    }
  });
})

$(document).on('click', '.edit_task',function() {
  let task_id = $(this).attr('data-editid')
  console.log(task_id)
  $.ajax({
    type: "GET",
    url: url + "api/task.php",
    data: { viewtask: true, task_id: task_id },
    dataType: "json",
    success: function (response) {
      console.log(response)
      $('#edit-taskname').val(response.name)
      $('#edit-desc').val(response.description)
      $('#edit-task-id').val(response.task_id);
    },
    complete: function () {
      $("#editttaskk").modal("show")
    }
  });
})

$(document).on('click','.done_task', function () {
  let taskid = $(this).attr('data-donetaskid')
  console.log(taskid)
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure the task id done?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No, not yet',
  }).then((result) => {
    if (result.isConfirmed) {
      donetask(taskid);
    }
  });
})

$('#taskedit').submit(function(e) {
  e.preventDefault();
  var formdata = new FormData(this)
  formdata.append('update', true)
  $.ajax({
    type: "POST",
    url: url + "api/task.php",
    data: formdata,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {
      Swal.fire({
        title: 'Success!',
        text: res.message,
        icon: res.status,
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(function () {
        $('#edittask').modal('hide');
        location.reload()
      })
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    }
  });
})
pagination();
function pagination () {
// Pagination 1
$(document).ready(function () {

  var itemsPerPage = 5;
  var currentPage = 1;
  var tableRows = $('#task-table tbody tr');
  var totalPages = Math.ceil(tableRows.length / itemsPerPage);


  tableRows.hide();


  tableRows.slice(0, itemsPerPage).show();


  function updatePagination() {

    var paginationNumbers = '';

    if (currentPage === 1) {
      paginationNumbers += '<li class="page-item disabled" id="prev-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="prev-page">';
    }

    paginationNumbers += '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>';

    for (var i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationNumbers += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
      } else {
        paginationNumbers += '<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>';
      }
    }

    if (currentPage === totalPages || totalPages === 0) {
      paginationNumbers += '<li class="page-item disabled" id="next-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="next-page">';
    }

    paginationNumbers += '<a class="page-link" href="#">Next</a></li>';
    $('#pagination-numbers').html(paginationNumbers);
  }


  $('#pagination-container').on('click', '.page-link', function () {
    var buttonText = $(this).text();
    if (buttonText === 'Next' && currentPage < totalPages) {
      tableRows.hide();
      currentPage++;
    } else if (buttonText === 'Previous' && currentPage > 1) {
      tableRows.hide();
      currentPage--;
    } else {
      var clickedPage = parseInt(buttonText);
      if (clickedPage >= 1 && clickedPage <= totalPages) {
        tableRows.hide();
        currentPage = clickedPage;
      }
    }

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    tableRows.slice(startIndex, endIndex).show();
    updatePagination();
  });


  updatePagination();
});
// Pagination 2
$(document).ready(function () {

  var itemsPerPage = 5;
  var currentPage = 1;
  var tableRows = $('#pending-table tbody tr');
  var totalPages = Math.ceil(tableRows.length / itemsPerPage);


  tableRows.hide();


  tableRows.slice(0, itemsPerPage).show();


  function updatePagination() {

    var paginationNumbers = '';

    if (currentPage === 1) {
      paginationNumbers += '<li class="page-item disabled" id="prev-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="prev-page">';
    }

    paginationNumbers += '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>';

    for (var i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationNumbers += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
      } else {
        paginationNumbers += '<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>';
      }
    }

    if (currentPage === totalPages || totalPages === 0) {
      paginationNumbers += '<li class="page-item disabled" id="next-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="next-page">';
    }

    paginationNumbers += '<a class="page-link" href="#">Next</a></li>';
    $('#pagination-numbers1').html(paginationNumbers);
  }


  $('#pagination-container1').on('click', '.page-link', function () {
    var buttonText = $(this).text();
    if (buttonText === 'Next' && currentPage < totalPages) {
      tableRows.hide();
      currentPage++;
    } else if (buttonText === 'Previous' && currentPage > 1) {
      tableRows.hide();
      currentPage--;
    } else {
      var clickedPage = parseInt(buttonText);
      if (clickedPage >= 1 && clickedPage <= totalPages) {
        tableRows.hide();
        currentPage = clickedPage;
      }
    }

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    tableRows.slice(startIndex, endIndex).show();
    updatePagination();
  });


  updatePagination();
});
// Pagination 3
$(document).ready(function () {

  var itemsPerPage = 5;
  var currentPage = 1;
  var tableRows = $('#pending-table tbody tr');
  var totalPages = Math.ceil(tableRows.length / itemsPerPage);


  tableRows.hide();


  tableRows.slice(0, itemsPerPage).show();


  function updatePagination() {

    var paginationNumbers = '';

    if (currentPage === 1) {
      paginationNumbers += '<li class="page-item disabled" id="prev-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="prev-page">';
    }

    paginationNumbers += '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>';

    for (var i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationNumbers += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
      } else {
        paginationNumbers += '<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>';
      }
    }

    if (currentPage === totalPages || totalPages === 0) {
      paginationNumbers += '<li class="page-item disabled" id="next-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="next-page">';
    }

    paginationNumbers += '<a class="page-link" href="#">Next</a></li>';
    $('#pagination-numbers2').html(paginationNumbers);
  }


  $('#pagination-container2').on('click', '.page-link', function () {
    var buttonText = $(this).text();
    if (buttonText === 'Next' && currentPage < totalPages) {
      tableRows.hide();
      currentPage++;
    } else if (buttonText === 'Previous' && currentPage > 1) {
      tableRows.hide();
      currentPage--;
    } else {
      var clickedPage = parseInt(buttonText);
      if (clickedPage >= 1 && clickedPage <= totalPages) {
        tableRows.hide();
        currentPage = clickedPage;
      }
    }

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    tableRows.slice(startIndex, endIndex).show();
    updatePagination();
  });


  updatePagination();
});
// Pagination 4
$(document).ready(function () {

  var itemsPerPage = 5;
  var currentPage = 1;
  var tableRows = $('#pending-table tbody tr');
  var totalPages = Math.ceil(tableRows.length / itemsPerPage);


  tableRows.hide();


  tableRows.slice(0, itemsPerPage).show();


  function updatePagination() {

    var paginationNumbers = '';

    if (currentPage === 1) {
      paginationNumbers += '<li class="page-item disabled" id="prev-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="prev-page">';
    }

    paginationNumbers += '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>';

    for (var i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationNumbers += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
      } else {
        paginationNumbers += '<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>';
      }
    }

    if (currentPage === totalPages || totalPages === 0) {
      paginationNumbers += '<li class="page-item disabled" id="next-page">';
    } else {
      paginationNumbers += '<li class="page-item" id="next-page">';
    }

    paginationNumbers += '<a class="page-link" href="#">Next</a></li>';
    $('#pagination-numbers3').html(paginationNumbers);
  }


  $('#pagination-container3').on('click', '.page-link', function () {
    var buttonText = $(this).text();
    if (buttonText === 'Next' && currentPage < totalPages) {
      tableRows.hide();
      currentPage++;
    } else if (buttonText === 'Previous' && currentPage > 1) {
      tableRows.hide();
      currentPage--;
    } else {
      var clickedPage = parseInt(buttonText);
      if (clickedPage >= 1 && clickedPage <= totalPages) {
        tableRows.hide();
        currentPage = clickedPage;
      }
    }

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    tableRows.slice(startIndex, endIndex).show();
    updatePagination();
  });


  updatePagination();
});
}

$('#searchtask').on('click', function () {
  let val = $('#search-task').val()
  displaytask(val);
})

function displaytask(val) {
  let searchval = val

  $.ajax({
    type: "GET",
    url: url + "api/task.php",
    data: { userid: userid, searchval: searchval },
    dataType: "json",
    success: function (res) {

      // Initialize HTML content for each section
      let pendingTasksHTML = '';
      let ongoingTasksHTML = '';
      let completedTasksHTML = '';
      let allTasksHTML = '';

      $.each(res.task, function (ind, val) {
        let date = new Date(val.datetime);

        let formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        let formattedTime = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        });

        // Determine badge color and section based on status
        let badgeColor = '';
        let button = '';
        if (val.status === 'Pending') {
          badgeColor = 'bg-info';
          button =
            `<div class="d-flex flex-wrap justify-content-center">
              <a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}">View</a> 
              <a class="btn-sm app-btn-secondary edit_task" href="#" data-editid="${val.task_id}" ><i class="fa-solid fa-pen-to-square"></i></a>
              <a class="btn-sm app-btn-secondary delete_task" href="#" data-trashid="${val.task_id}"><i class="fa-solid fa-trash"></i></a>
              <a class="btn-sm app-btn-secondary do_now" href="#" data-donowid="${val.task_id}"><i class="fa-solid fa-check"></i> Do Now</a></div>`
        } else if (val.status === 'Ongoing') {
          badgeColor = 'bg-warning';
          button = `<div class="d-flex flex-wrap justify-content-center"><a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}" >View</a>
            <a class="btn-sm app-btn-secondary done_task" href="#" data-donetaskid="${val.task_id}"><i class="fa-solid fa-check-double"></i> Done</a></div>`
        } else if (val.status === 'Complete') {
          badgeColor = 'bg-success';
          button = `<div class="d-flex flex-wrap justify-content-center"><a class="btn-sm app-btn-secondary view_task" href="#" data-viewid="${val.task_id}" >View</a></div>`
        }

        // Create the task row HTML
        let taskRow = `<tr>
          <td class="cell">#${val.task_id}</td>
          <td class="cell"><span class="truncate">${val.name}</span></td>
          <td class="cell">${val.description}</td>
          <td class="cell"><span>${formattedDate}</span><span class="note">${formattedTime}</span></td>
          <td class="cell"><span class="badge ${badgeColor}">${val.status}</span></td>
          <td class="cell">${button}</td>
        </tr>`;

        // Add the task row HTML to the appropriate section variable
        if (val.status === 'Pending') {
          pendingTasksHTML += taskRow;
        } else if (val.status === 'Ongoing') {
          ongoingTasksHTML += taskRow;
        } else if (val.status === 'Complete') {
          completedTasksHTML += taskRow;
        }
        
        // Add the task row HTML to the 'allTasksHTML' variable
        allTasksHTML += taskRow;
      });

      // Set the HTML content of each section
      $('#pending-taskk').html(pendingTasksHTML);
      $('#ongoing-task').html(ongoingTasksHTML);
      $('#completed-task').html(completedTasksHTML);
      $('#all-task').html(allTasksHTML);
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    },
    complete: function () {
      pagination();
    }
  });
}