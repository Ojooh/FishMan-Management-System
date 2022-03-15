import { validateLogin } from './validator.js';
import { showError, swalShowLoading } from './helper.js';

jQuery(document).ready(function ($) {
    var loginBtn = $(".loginBtn");
    var error = $('.error');

    loginBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        error.html("");
        var username = $('#username').val();
        var password = $('#password').val();
        let params = {};
        let data = { username: username, pass: password };

        let [n, state, msg] = validateLogin(data);

        if (!state) {
            showError("danger", msg.message, "error");
        }
        else {
            params.url = "/auth/login";
            params.data = data;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Authenticating User", "Please wait, while Credentials are being vetted")
            };
            params.success = function (data) {
                if (data.success) {
                    Swal.fire(data.success, "Click OK to proceed", "success").then(
                        function () {
                            location.replace(data.url);
                        }
                    )
                }
                else {
                    swal.close();
                    Swal.fire(data.error, "Click OK to proceed", "error").then(
                        function () {
                            location.reload();
                        }
                    )
                }

            };

            $.ajax(params);
        }
    });

});


