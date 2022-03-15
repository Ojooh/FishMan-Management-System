import { showError, swalShowLoading, validateName, isEmpty, isImage, validInteger, validFloat } from './helper.js';

jQuery(document).ready(function ($) {
    var addType = $("#addType");
    var addProduct = $("#addProd");
    var type = $(".type-row");
    var active = $("#active");
    var edit = $("#edit");
    var remove = $(".remove");

    type.on("click", function (e) {
        e.preventDefault();

        let id = $(this).attr("data-id");
        let name = $(this).attr("data-name");
        let key = ".product-type-" + id;
        $(".type-row").removeClass("table-active");
        $("#prodType").val(name);
        addProduct.attr("data-type", id);
        $(this).addClass("table-active");
        if ($(key).length > 0) {
            $(".product").addClass("deactivated");
            $(".prd").addClass("deactivated");
            $(key).removeClass("deactivated");


        } else {
            $(".product").addClass("deactivated");
            $(".prd").removeClass("deactivated");
            addProduct.attr("data-type", undefined);
        }
    })

    addType.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        let link = $("#typeImg")[0].files[0];
        let name = $("#typeName").val();
        let params = {};
        console.log(link);

        if (!link || isImage(link) == false) {
            showError("danger", "Type Image Input is not Valid, must be an image file", "error-p");
        }
        else if (isEmpty(name) || validateName(name) == false) {
            showError("danger", "Type Name Input is not Valid", "error-ty");
        } else {
            let data = new FormData();
            data.append("name", name);
            data.append("link", link);
            data.append("type", "add");
            params.url = "/admin/add_type";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Creating New Type", "Please wait, while Type is being created")
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

    addProduct.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        let link = $("#prodImg")[0].files[0];
        let type = $(this).attr("data-type");
        let name = $("#prodName").val();
        let qty = $("#qty").val();
        let size = $("#size").val();
        let bprice = $("#bPrice").val();
        let sprice = $("#sPrice").val()

        let params = {};
        console.log(sprice);

        if (!type || isEmpty(type) || type == "undefined") {
            showError("danger", "No product Type was selected please go back and select a product", "error-p");
        }
        else if (!link || isImage(link) == false) {
            showError("danger", "Type Image Input is not Valid, must be an image file", "error-p");
        }
        else if (isEmpty(name) || validateName(name) == false) {
            showError("danger", "Type Name Input is not Valid", "error-p");
        }
        else if (isEmpty(qty) || validInteger(qty) == false) {
            showError("danger", "Quantity Input is not Valid", "error-p");
        }
        else if (isEmpty(size) || validFloat(size) == false) {
            showError("danger", "Size Input is not Valid", "error-p");
        }
        else if (isEmpty(bprice) || validFloat(bprice) == false) {
            showError("danger", "Buy Price Input is not Valid", "error-p");
        }
        else if (isEmpty(sprice) || validFloat(sprice) == false || parseFloat(sprice) < parseFloat(bprice)) {
            showError("danger", "Sell Price Input is not Valid, must be greater than buy price", "error-p");
        }
        else {
            let data = new FormData();
            data.append("type", type);
            data.append("name", name);
            data.append("link", link);
            data.append("qty", qty);
            data.append("size", size);
            data.append("bprice", bprice);
            data.append("sprice", sprice);
            data.append("type", "add");
            params.url = "/admin/add_product";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Creating New Product", "Please wait, while Product is being created")
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