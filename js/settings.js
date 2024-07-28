$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: url + "api/settings.php",
    data: { userid: userid },
    dataType: "json",
    success: function (res) {
      let val = res[0]
      $('#fname').val(val.fname)
      $('#lname').val(val.lname)
      $('#username').val(val.user)
      $('#email').val(val.email)
    }
  });
})

$('#account-setting').submit(function (e) {
  e.preventDefault();

  let formdata = new FormData(this)
  formdata.append('userid', userid)
  formdata.append('update', true)
  $.ajax({
    type: "POST",
    url: url + "api/settings.php",
    data: formdata,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {
      toast.fire({
        icon: res.status,
        title: res.message,
      });
    }
  });
})

$('#changepassform').submit(function (e) {
  e.preventDefault();
  let formdata = new FormData(this)
  formdata.append('userid', userid);
  formdata.append('changepass', true)

  $.ajax({
    type: "POST",
    url: url + "api/settings.php",
    data: formdata,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {
      toast.fire({
        icon: res.status,
        title: res.message,
      });
    }
  });
})