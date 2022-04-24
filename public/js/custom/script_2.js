import { showError, swalShowLoading, validateName, isEmpty, isImage, validInteger, validFloat } from './helper.js';

jQuery(document).ready(function ($) {
    var typeModal = $("#typeModal");
    var prodModal = $("#productModal");
    var submitType = $("#addType");
    var submitProduct = $("#addProd");
    var type = $(".type-row");
    var product = $(".product-row");
    var editType = $("#editType");
    var toggleState = $("#toggleState");
    var permDelete = $("#permDelete");
    var editProduct = $("#editProduct");
    var toggleProdState = $("#toggleProdState");
    var permDeleteProd = $("#permDeleteProd");
    var loadLog = $(".load-logs");



    type.on("click", function (e) {
        e.preventDefault();

        let id = $(this).attr("data-id");
        let name = $(this).attr("data-name");
        let key = ".product-type-" + id;
        $(".type-row").removeClass("table-active");
        $("#prodType").val(name);
        submitProduct.attr("data-type", id);
        $(this).addClass("table-active");
        if ($(key).length > 0) {
            $(".product").addClass("deactivated");
            $(".prd").addClass("deactivated");
            $(key).removeClass("deactivated");


        } else {
            $(".product").addClass("deactivated");
            $(".prd").removeClass("deactivated");
            submitProduct.attr("data-type", undefined);
        }
    });

    product.on("click", function (e) {
        e.preventDefault();

        let id = $(this).attr("data-id");
        let key = ".product-view-" + id;
        $(".product-row").removeClass("table-active-pro");
        $(this).addClass("table-active-pro");
        if ($(key).length > 0) {
            $(".product-view").addClass("deactivated");
            $(".prd").addClass("deactivated");
            $(key).removeClass("deactivated");


        } else {
            $(".product-view").addClass("deactivated");
            $(".prd").removeClass("deactivated");
        }
    });

    editType.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active').length <= 0) {
            showError("danger", "Select a type first to edit", "error-st");
        } else {
            var name = $('.table-active').attr("data-name");
            var link = $(".table-active").attr("data-link");
            var ID = $('.table-active').attr("data-id");
            console.log(link)
            $("#output_1").attr("src", link);
            $("#typeName").val(name);
            $("#addType").html("Update");
            $("#addType").attr("data-id", ID);
            typeModal.modal("show");
        }
    });

    toggleState.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active').length <= 0) {
            showError("danger", "Select a type first to Activate/Deactivate", "error-st");
        } else {
            let params = {};
            var name = $('.table-active').attr("data-name");
            var state = $(".table.active").attr("data-state");
            var ID = $('.table-active').attr("data-id");

            let data = new FormData();
            data.append("ID", ID);
            data.append("name", name);
            data.append("table", "fish_type");
            data.append("state", state);
            params.url = "/admin/toggle_state";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Updating" + name + " Product type", "Please wait, while Type is being updated")
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

    permDelete.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active').length <= 0) {
            showError("danger", "Select a type first to Delete", "error-st");
        } else {
            let params = {};
            var name = $('.table-active').attr("data-name");
            var ID = $('.table-active').attr("data-id");

            let data = new FormData();
            data.append("ID", ID);
            data.append("name", name);
            data.append("table", "fish_type");
            params.url = "/admin/delete_item";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Updating" + name + " Product type", "Please wait, while Type is being updated")
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
                title: 'Are you sure want to Delete' + name + '?',
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

        }
    });

    editProduct.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active-pro').length <= 0) {
            showError("danger", "Select a Product first to edit", "error-st");
        } else {
            var name = $('.table-active-pro').attr("data-name");
            var ID = $('.table-active-pro').attr("data-id");
            var info = $('.table-active-pro').attr("data-info").split("*");
            let link = info[0];
            let type = $('.table-active').attr("data-name");
            let qty = info[2];
            let size = info[3];
            let bought = info[4];
            let sell = info[5];
            let pieces = info[6];

            $("#output_2").attr("src", link);
            $("#prodType").val(type);
            $("#prodName").val(name)
            $("#qty").val(qty)
            $("#size").val(size)
            $("#bPrice").val(bought)
            $("#sPrice").val(sell)
            $("#pieces").val(pieces)
            submitProduct.html("Update");
            submitProduct.attr("data-id", ID);
            submitProduct.attr("data-type", info[1]);
            prodModal.modal("show");
        }
    });

    toggleProdState.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active-pro').length <= 0) {
            showError("danger", "Select a Product first to Activate/Deactivate", "error-st");
        } else {
            let params = {};
            var name = $('.table-active-pro').attr("data-name");
            var state = $(".table.active-pro").attr("data-state");
            var ID = $('.table-active-pro').attr("data-id");

            let data = new FormData();
            data.append("ID", ID);
            data.append("name", name);
            data.append("table", "products");
            data.append("state", state);
            params.url = "/admin/toggle_state";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Updating" + name + " Product", "Please wait, while Product is being updated")
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

    permDeleteProd.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active').length <= 0) {
            showError("danger", "Select a Product first to Delete", "error-st");
        } else {
            let params = {};
            var name = $('.table-active-pro').attr("data-name");
            var ID = $('.table-active-pro').attr("data-id");

            let data = new FormData();
            data.append("ID", ID);
            data.append("name", name);
            data.append("table", "products");
            params.url = "/admin/delete_item";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Updating" + name + " Product", "Please wait, while Product is being updated")
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
                title: 'Are you sure want to Delete' + name + '?',
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

        }
    });

    submitType.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        let link = $("#typeImg")[0].files[0];
        let name = $("#typeName").val();
        let ID = $(this).attr("data-id");
        let params = {};


        if (link && isImage(link) == false) {
            showError("danger", "Type Image Input is not Valid, must be an image file", "error-ty");
        }
        else if (isEmpty(name) || validateName(name) == false) {
            showError("danger", "Type Name Input is not Valid", "error-ty");
        } else {
            let data = new FormData();
            data.append("name", name);
            data.append("link", link);

            params.contentType = false;
            params.processData = false;
            params.type = "post";
            if (ID && ID != "" && ID != "") {
                data.append("type", "edit");
                data.append("ID", ID);
                params.url = "/admin/edit_type";
                params.beforeSend = function () {
                    swalShowLoading("Updating" + name + " Type", "Please wait, while Type is being updated")
                };
            } else {
                data.append("type", "add");
                params.url = "/admin/add_type";
                params.beforeSend = function () {
                    swalShowLoading("Creating New Type", "Please wait, while Type is being created")
                };
            }
            params.data = data;

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

    submitProduct.on("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        let link = $("#prodImg")[0].files[0];
        let type = $(this).attr("data-type");
        let name = $("#prodName").val();
        let qty = $("#qty").val();
        let pieces = $("#pieces").val();
        let size = $("#size").val();
        let bprice = $("#bPrice").val();
        let sprice = $("#sPrice").val();
        let ID = $(this).attr("data-id");

        let params = {};
        console.log(sprice);

        if (!type || isEmpty(type) || type == "undefined") {
            showError("danger", "No product Type was selected please go back and select a product", "error-p");
        }
        else if (link && isImage(link) == false) {
            showError("danger", "Type Image Input is not Valid, must be an image file", "error-p");
        }
        else if (isEmpty(name) || validateName(name) == false) {
            showError("danger", "Type Name Input is not Valid", "error-p");
        }
        else if (isEmpty(qty) || validFloat(qty) == false) {
            showError("danger", "Quantity Input is not Valid", "error-p");
        }
        else if (isEmpty(pieces) || validInteger(pieces) == false) {
            showError("danger", "Pieces Input is not Valid", "error-p");
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
            data.append("pieces", pieces);
            data.append("size", size);
            data.append("bprice", bprice);
            data.append("sprice", sprice);
            if (ID && ID != "" && ID != "") {
                data.append("type", "edit");
                data.append("ID", ID);
                params.url = "/admin/edit_product";
                params.beforeSend = function () {
                    swalShowLoading("Updating" + name + " Product", "Please wait, while Product is being updated")
                };
            } else {
                data.append("type", "add");
                params.url = "/admin/add_product";
                params.beforeSend = function () {
                    swalShowLoading("Creating New Product", "Please wait, while Product is being created")
                };
            }

            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
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

    loadLog.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('.table-active-pro').length <= 0) {
            showError("danger", "Select a type first to View Log", "error-st");
        } else {
            let params = {};
            var name = $('.table-active-pro').attr("data-name");
            var ID = $('.table-active-pro').attr("data-id");
            let key = "#prodLog-" + ID;
            var prodLog = $(key);

            let data = new FormData();
            data.append("ID", ID);
            params.url = "/admin/get_prod_log";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Fetching " + name + " Product Log", "Please wait, while " + name + " is being fetched")
            };
            params.success = function (data) {

                if (data.success) {
                    swal.close();
                    console.log(data);
                    let html = ``;
                    let j = 1;
                    prodLog.html("")
                    data.data.forEach(function (item) {
                        html += `<tr>
                            <th scope="row">`+ j + `</th>
                            <td>`+ item["date_created"] + `</td>
                            <td>`+ item["qty"] + `</td>
                            <td>`+ item["pieces"] + `</td>
                            <td>`+ item["size"] + `</td>
                            <td>`+ item["bought"] + `</td>
                            <td>`+ item["sell"] + `</td>
                        </tr>`
                        j = j + 1;
                    });
                    prodLog.html(html);
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