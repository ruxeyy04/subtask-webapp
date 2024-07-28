$('#login').submit(function (e) {
  e.preventDefault();
  var formData = new FormData(this);
  $.ajax({
    type: "POST",
    url: url + "api/login.php",
    data: formData,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {

      if (res.status === 'success') {
        $.cookie('userid', res.userid, { expires: 1, path: '/' });
        Swal.fire({
          icon: 'success',
          title: 'Logged In Successfully',
          showConfirmButton: false,
          timer: 2500,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: function () {
            setTimeout(function () {
              window.location.href = 'index.html';
            }, 2500);
          }
        });
      } else {
        toast1.fire({
          icon: "error",
          title: "Incorrect Username or Password",
        });
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
    }
  });
})

if ($.cookie('userid')) {
  location.replace('index.html')

}