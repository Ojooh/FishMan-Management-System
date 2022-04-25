import { showError, swalShowLoading, isEmpty, validInteger, validFloat } from './helper.js';

jQuery(document).ready(function ($) {
    var typeBtn = $(".type-btn");
    var searchBtn = $('#searchBtn');
    var orderList = $("#orderList");
    var prods = $(".prods");
    var discount = $("#discount");
    var sub = $(".sub");
    var tax = $(".tax");
    var total = $(".total");
    var payBtn = $("#payBtn");
    var payModal = $("#payModal");
    let totalPrice = 0;
    let newTotalPrice = 0;
    let subTotal = 0;
    let disc = 0;
    let tx = tax.attr("data-tax");
    let cancelOrder = $(".cancel");
    let holdOrder = $(".hold-order");
    let holdCount = $(".hold-count");
    var order = [];
    var hold = [];

    function RenderOrder(order, checkout = false) {

        let html = ``;
        let html2 = ``;
        if (order.length < 0) {
            orderList.html(html);
        } else {
            let indx = 0;
            console.log(checkout);
            order.forEach(function (item) {
                html += `<tr class="border-bottom">
                            <td class="remove-order" data-id="` + indx + `">
                                <i class="fa fa-trash"></i>
                            </td>
                            <td>` + item.name + `</td>
                            <td>
                                <select class="form-select" aria-label="Default select example">
                                    <option selected disabled>Select</option>
                                    <option value="1">per Carton</option>
                                    <option value="2">per KG</option>
                                </select>
                            </td>
                            <td>
                                <input type="number" class="form-control" />
                            </td>
                            <td>&#8358;` + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                        </tr>`
                if (checkout) {
                    html2 += `<tr>
                                <th scope="row">` + (parseInt(indx) + 1) + `</th>
                                <td>` + item.name + `</td>
                                <td>` + item.size + `</td>
                                <td>&#8358;` + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                                
                            </tr>
                            `;
                }
                indx = indx + 1;
            });
            orderList.html(html);
            console.log(html2)
            if (checkout) {
                $(".checkout").html(html2);
            }
        }
    };

    function DeleteFromOrder(indx) {
        if (order.length > 0) {
            indx = parseInt(indx);
            totalPrice = totalPrice - parseFloat(order[indx].price);
            subTotal = totalPrice + parseFloat(tx);
            sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
            order.splice(indx, 1);
        }
    };

    discount.on("keyup", function (e) {
        disc = parseInt($(this).val());
        console.log(disc);

        if (disc && disc > 0 && disc < 100) {
            console.log(totalPrice);
            newTotalPrice = totalPrice - ((disc / 100) * totalPrice);
            subTotal = newTotalPrice + parseFloat(tx);
            sub.html(`&#8358;` + newTotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
        } else {
            $(".disc-error").html("Dicount Value must be a percentage from 1%");
            subTotal = totalPrice + parseFloat(tx);
            sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
        }
    })

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

    prods.on("dblclick", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let dor = {};
        var info = $(this).attr("data-info").split("*");

        dor.ID = $(this).attr("data-id");
        dor.name = $(this).attr("data-name");
        dor.link = info[0];
        dor.type = info[7];
        dor.qty = info[2];
        dor.size = info[3];
        dor.bought = info[4];
        dor.sell = info[5];
        dor.price = info[5];
        dor.pieces = info[6];

        if (order.some(order => order.name === dor.name) == false) {
            order.push(dor);
            totalPrice = totalPrice + parseFloat(info[5]);
            subTotal = totalPrice + parseFloat(tx);
        }

        RenderOrder(order);
        sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
    });

    $(document).on("click", ".remove-order", function (e) {
        let indx = $(this).attr("data-id");
        console.log(indx)

        DeleteFromOrder(indx);
        RenderOrder(order)
    })

    cancelOrder.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        order = [];
        RenderOrder(order);
        totalPrice = 0;
        subTotal = 0;
        disc = 0;
        discount.val("");
        sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
    });

    holdOrder.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        hold.push(order);
        holdCount.html(hold.length.toString());
        order = [];
        RenderOrder(order);
        totalPrice = 0;
        subTotal = 0;
        disc = 0;
        discount.val("");
        sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
    });

    payBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("here");

        if (totalPrice && totalPrice > 0 && order && order.length > 0) {
            RenderOrder(order, true);
            let py = "&#8358; " + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
            $(".fw-normal").html("(" + py + ")");
            $(".cardy").html("Total: " + py);
            payModal.modal("show");
        }

    });







})