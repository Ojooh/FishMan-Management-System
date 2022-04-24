import { showError, swalShowLoading, isEmpty, validInteger, validFloat } from './helper.js';

jQuery(document).ready(function ($) {
    var typeBtn = $(".type-btn");
    var searchBtn = $('#searchBtn');


    typeBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let ID = $(this).attr("data-id");
        let key = ".prods-" + ID;

        $(".prods").addClass("deactivated");
        $(key).removeClass("deactivated");

        typeBtn.addClass("active");
        $(this).removeClass("active");
        $(this).addClass("chosen");
    });

    searchBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let ID = (($(".type-btn.chosen").attr("data-id")) ? $(".type-btn.chosen").attr("data-id") : '');
        let srch = $("#searchInput").val();
        let params = {};

        let data = new FormData();
        data.append("ID", ID);
        data.append("srch", srch);
        params.url = "/admin/search_prod_by_type";
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
                $(".prods").addClass("deactivated");
                data.data.forEach(function (item) {
                    let did = item["id"];
                    let key = ".prod-" + did;
                    $(key).removeClass("deactivated");

                });
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

        if (srch && isEmpty(srch) == false) {
            $.ajax(params);
        }

    });





})