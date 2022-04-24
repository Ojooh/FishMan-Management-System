import { showError, swalShowLoading, isEmpty, validInteger, validFloat } from './helper.js';

jQuery(document).ready(function ($) {
    var submitVault = $("#submitVault");
    var clear = $(".clear");
    var size = $("#size");
    var loadProducts = $("#prod_type");

    clear.on("click", function (e) {
        $("input, textarea, select").val("");
    });

    loadProducts.on("change", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let params = {};
        var ID = $(this).val();

        let data = new FormData();
        data.append("ID", ID);
        params.url = "/admin/get_prod_by_type";
        params.data = data;
        params.contentType = false;
        params.processData = false;
        params.type = "post";
        params.beforeSend = function () {
            swalShowLoading("Fetching products", "Please wait, while products are being fetched")
        };
        params.success = function (data) {
            if (data.success) {
                swal.close();
                console.log(data);
                let html = `<option selected disabled>Select...</option>`;
                $("#product").html("<option selected disabled>Select...</option>")
                data.data.forEach(function (item) {
                    html += `<option value="` + item["id"] + '*' + item["sell"] + `">
                           `+ item["name"] + `
                        </option>`
                });
                $("#product").html(html);
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
    });

    size.on("keyup", function (e) {
        var sell = parseFloat($("#product").val().split("*")[1]);
        var sz = $(this).val();
        console.log(sz)

        if (sz && sell && isEmpty(sz) == false && validFloat(sz)) {
            let prc = (parseFloat(sz) * sell).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $("#price").val(prc);
        }
    });

    submitVault.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let prod_type = $("#prod_type").val();
        let prod = $("#product").val();
        let vlt_type = $("#vault_type").val();
        let qty = $("#qty").val();
        let size = $("#size").val();
        let price = $("#price").val();
        let remark = $("#remark").val();

        let params = {};

        if (!prod_type || isEmpty(prod_type)) {
            showError("danger", "No Product Type was selected please go back and select a product type", "error-p");
        }
        else if (!prod || isEmpty(prod)) {
            showError("danger", "No Product was selected please go back and select a product", "error-p");
        }
        else if (!vlt_type || isEmpty(vlt_type)) {
            showError("danger", "No Vault Type was selected please go back and select a Vault Type", "error-p");
        }
        else if (isEmpty(qty) || validInteger(qty) == false) {
            showError("danger", "Quantity Input is not Valid", "error-p");
        }
        else if (isEmpty(size) || validFloat(size) == false) {
            showError("danger", "Size Input is not Valid", "error-p");
        }
        else if (isEmpty(price) || validFloat(price) == false) {
            showError("danger", "Price Input is not Valid", "error-p");
        }
        else {
            let data = new FormData();
            data.append("prod_type", prod_type);
            data.append("prod", prod);
            data.append("vlt_type", vlt_type);
            data.append("qty", qty);
            data.append("size", size);
            data.append("price", price);
            data.append("remark", remark);
            data.append("type", "add");
            params.url = "/admin/add_vault";
            params.beforeSend = function () {
                swalShowLoading("Vaulting Record being created", "Please wait, while record is being created")
            };

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


});
