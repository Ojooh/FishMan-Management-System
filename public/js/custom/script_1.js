import { showError, swalShowLoading, validateName, validateNamey, validateEmail, validateTel, validatePass, isEmpty } from './helper.js';

jQuery(document).ready(function ($) {
    var add = $("#add");
    var active = $("#active");
    var edit = $("#edit");
    var remove = $(".remove");

    $("#email").on("change", function () {
        let ray = $(this).val().split("@")[0];
        const val = Math.floor(1000 + Math.random() * 9000);
        let username = "@" + ray + val
        $("#username").val(username)
    });

    add.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();


        let fnamey = $("#fname").val();
        let lnamey = $("#lname").val();
        let gendery = $("#gender").val();
        let roley = $("#role").val();
        let emaily = $("#email").val();
        let phoney = $("#phone").val();
        let passwordy = $("#password").val();
        let params = {};

        if (isEmpty(fnamey) || validateName(fnamey) == false) {
            showError("danger", "First Name Input is not Valid", "error-u");
        }
        else if (isEmpty(lnamey) || validateName(lnamey) == false) {
            showError("danger", "Last Name Input is not Valid", "error-u");
        }
        else if (isEmpty(gendery)) {
            showError("danger", "Gender Input is not Valid", "error-u");
        }
        else if (isEmpty(roley)) {
            showError("danger", "Role Input is not Valid", "error-u");
        }
        else if (isEmpty(emaily) || validateEmail(emaily) == false) {
            showError("danger", "Email Input is not Valid", "error-u");
        }
        else if (!isEmpty(phoney) && validateTel(phoney) == false) {
            showError("danger", "Phone Input is not Valid", "error-u");
        }
        else if (isEmpty(passwordy) || validatePass(passwordy) == false) {
            showError("danger", "Password Input is not Valid", "error-u");
        } else {
            let data = new FormData();
            data.append("username", $("#username").val());
            data.append("fname", fnamey);
            data.append("lname", lnamey);
            data.append("gender", gendery);
            data.append("user_type", roley)
            data.append("email", emaily);
            data.append("phone", phoney);
            data.append("password", passwordy);
            data.append("type", "add");
            params.url = "/admin/add_user";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Creating New User", "Please wait, while User is being created")
            };
            params.success = function (data) {
                if (data.success) {
                    Swal.fire(data.success, "Click OK to proceed", "success").then(
                        function () {
                            location.reload();
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

    edit.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();


        let fnamey = $("#fname").val();
        let lnamey = $("#lname").val();
        let gendery = $("#gender").val();
        let roley = $("#role").val();
        let emaily = $("#email").val();
        let phoney = $("#phone").val();
        let passwordy = $("#password").val();
        let ID = $(this).attr("data-id");
        let passy = $(this).attr("data-pass");
        let params = {};

        if (isEmpty(fnamey) || validateName(fnamey) == false) {
            showError("danger", "First Name Input is not Valid", "error-u");
        }
        else if (isEmpty(lnamey) || validateName(lnamey) == false) {
            showError("danger", "Last Name Input is not Valid", "error-u");
        }
        else if (isEmpty(gendery)) {
            showError("danger", "Gender Input is not Valid", "error-u");
        }
        else if (isEmpty(roley)) {
            showError("danger", "Role Input is not Valid", "error-u");
        }
        else if (isEmpty(emaily) || validateEmail(emaily) == false) {
            showError("danger", "Email Input is not Valid", "error-u");
        }
        else if (!isEmpty(phoney) && validateTel(phoney) == false) {
            showError("danger", "Phone Input is not Valid", "error-u");
        }
        else if (!isEmpty(passwordy) && validatePass(passwordy) == false) {
            showError("danger", "Password Input is not Valid", "error-u");
        } else {
            let data = new FormData();
            data.append("username", $("#username").val());
            data.append("fname", fnamey);
            data.append("lname", lnamey);
            data.append("gender", gendery);
            data.append("user_type", roley)
            data.append("email", emaily);
            data.append("phone", phoney);
            if (passwordy != "") {
                data.append("password", passwordy);
            } else {
                data.append("password", passwordy);
                data.append("passwordy", passy);
            }
            data.append("ID", ID);
            data.append("type", "edit");
            params.url = "/admin/edit_user";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Updating User Profile", "Please wait, while User profile is being updated")
            };
            params.success = function (data) {
                if (data.success) {
                    Swal.fire(data.success, "Click OK to proceed", "success").then(
                        function () {
                            location.reload();
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

    remove.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();


        let ID = $(this).attr("data-id");
        let table = $(this).attr("data-table");
        let name = $(this).attr("data-name");
        let params = {};

        let data = new FormData();
        data.append("ID", ID);
        data.append("table", table);
        data.append("name", name);
        params.url = "/admin/delete_item";
        params.data = data;
        params.contentType = false;
        params.processData = false;
        params.type = "post";

        params.beforeSend = function () {
            swalShowLoading("Delete Operation ongoing", "Please wait, while User profile is being deleted")
        };

        params.success = function (data) {
            if (data.success) {
                Swal.fire(data.success, "Click OK to proceed", "success").then(
                    function () {
                        location.reload();
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

        Swal.fire({
            title: 'Are you sure want to Delete ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            allowOutsideClick: false,
        }).then(async (result) => {
            if (result.value) {
                $.ajax(params);
            }
        });



    })

});