function urlLink() {
  let urlLink = "https://subtask.logiclynxz.com/"
  return urlLink
}
let url = urlLink()

var userid = ''
if ($.cookie('userid')) {
  userid = $.cookie('userid')
}

// if (!$.cookie('userid')) {
//   location.replace('login.html')
// }

  // ===========================================
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const toast1 = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  // ===================================================

  $(document).on("click", "#logout", function () {
    $.removeCookie("userid");
    window.location.href = "login.html";

  });