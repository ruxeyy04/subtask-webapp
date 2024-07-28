$('#reg_form').submit(function (e) {
  e.preventDefault();
  var formData = new FormData(this);
  // formData.forEach(function(value, key){
  //   console.log(key, value);
  // });
  $.ajax({
    type: "POST",
    url: url + "api/register.php",
    data: formData,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (res) {
      if(res.status === 'success') {
        Swal.fire({
          title: 'Success!',
          text: 'User Registered Successfully',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
      }).then(function() { 
        location.replace('login.html')
      })
    }
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText);
  }
  });
})