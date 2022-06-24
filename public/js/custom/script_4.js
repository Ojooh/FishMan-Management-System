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
    var collect = $(".collect");
    var pay = $(".pay");
    let totalPrice = 0;
    let newTotalPrice = 0;
    let subTotal = 0;
    let disc = 0;
    let amt_given = 0;
    let change = 0;
    let tx = tax.attr("data-tax");
    let cancelOrder = $(".cancel");
    let holdOrder = $(".hold-order");
    let holdCount = $(".hold-count");
    var order = [];
    var hold = [];
    let collected = false;
    let good = true;
    let pmy = [];
    let det = []
    let status = "";
    let payment_type = "CARD";


    tax.html(tx.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", "));

    function RenderOrder(order, checkout = false) {

        let html = ``;
        let html2 = ``;
        if (order.length < 0) {
            orderList.html(html);
        } else {
            let indx = 0;
            totalPrice = 0
            order.forEach(function (item) {
                totalPrice += parseFloat(item.price);
                html += `<tr class="border-bottom">
                            <td class="remove-order" data-id="` + indx + `">
                                <i class="fa fa-trash"></i>
                            </td>
                            <td>` + item.name + `</td>
                            <td>
                                <select class="form-select" data-id="` + indx + `" id="vlt_type" aria-label="Default select example">
                                    <option selected value="` + det[indx].vlt_type + `" disabled>` + det[indx].vlt_type + `</option>
                                    <option value="Single">Single</option>
                                    <option value="Carton">Carton</option>
                                </select>
                            </td>
                            <td>
                                <input type="number" value="` + det[indx].qty + `" data-id="` + indx + `" id="qty" class="form-control" />
                            </td>
                            <td>
                                <input type="number" value="` + det[indx].size + `" data-id="` + indx + `" id="size" class="form-control" />
                            </td>
                            <td>&#8358;` + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                        </tr>`
                if (checkout) {
                    html2 += `<tr>
                                <th scope="row">` + (parseInt(indx) + 1) + `</th>
                                <td>` + item.name + `</td>
                                <td>` + det[indx].size + `</td>
                                <td>&#8358;` + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                                
                            </tr>
                            `;
                }
                indx = indx + 1;
            });
            //console.log(totalPrice);
            totalPrice = parseFloat(totalPrice).toFixed(2);
            subTotal = parseFloat(totalPrice) + parseFloat(tx);
            subTotal = parseFloat(subTotal).toFixed(2);

            orderList.html(html);
            sub.html(`&#8358;` + totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
            // //console.log(html2)
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
            pmy.splice(indx, 1);
            det.splice(indx, 1);
        }
    };

    async function qtyAvailable(qty, id, vlt_type, vtypel) {
        if (validInteger(qty) && vlt_type != "" && vtypel == true) {
            let params = {};
            let msg;
            let state;
            let send;
            let data = new FormData();
            data.append("qty", qty);
            data.append("ID", id);
            data.append("typ", vlt_type);
            params.url = "/admin/validate_prd_qty_avl";
            params.data = data;
            params.contentType = false;
            params.processData = false;
            params.type = "post";
            params.beforeSend = function () {
                swalShowLoading("Fetching products", "Please wait, while products are being fetched")
            };
            params.success = function (data) {
                //console.log(data);
                swal.close();

                if (data.success && data.avl) {
                    msg = "Quantity is available"
                    state = true;
                    send = data.vlt_id
                } else {
                    msg = ((data.success) ? data.success : data.error);
                    //console.log(msg);
                    state = false
                    send = null
                }

            };
            await $.ajax(params);
            return [state, msg, send];

        } else {
            let msg = ((validInteger(qty) == false) ? 'Invalid Input for Quntity' : 'Please select a type first before entering Quanitty')
            return [false, msg];
        }
    }

    discount.on("keyup", function (e) {
        disc = parseInt($(this).val());
        //console.log(disc);

        if (disc && disc > 0 && disc < 100) {
            //console.log(totalPrice);
            newTotalPrice = parseFloat(totalPrice - ((disc / 100) * totalPrice)).toFixed(2);
            subTotal = (parseFloat(newTotalPrice) + parseFloat(tx)).toFixed(2)
            sub.html(`&#8358;` + newTotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            total.html(`&#8358;` + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            payBtn.html("Pay (&#8358;" + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")");
        } else {
            $(".disc-error").html("Dicount Value must be a percentage from 1%");
            subTotal = parseFloat(totalPrice) + parseFloat(tx);
            subTotal = parseFloat(subTotal).toFixed(2);
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
                //console.log(data);
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
        let ps = {};
        let fr = {};
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
        ps.vtypel = false;
        ps.sizel = false;
        ps.qtyl = false
        fr.vlt_type = "";
        fr.qty = 0
        fr.size = 1;

        if (order.some(order => order.name === dor.name) == false) {
            order.push(dor);
            pmy.push(ps);
            det.push(fr)
        }

        RenderOrder(order);

    });


    $(document).on("click", ".remove-order", function (e) {
        let indx = $(this).attr("data-id");
        //console.log(indx)

        DeleteFromOrder(indx);
        RenderOrder(order)
    });


    $(document).on("change", "#vlt_type", function (e) {

        let vlt_type = $(this).val();
        var order_id = parseInt($(this).attr("data-id"));
        $($("#qty")[order_id]).val(0);
        $($("#size")[order_id]).val(1);

        if (vlt_type && vlt_type != "") {
            pmy[order_id]["vtypel"] = true;
            det[order_id].vlt_type = $(this).val();
            det[order_id].qty = 0;

            order[order_id]["vlt_type"] = vlt_type;
            pmy[order_id]["qtyl"] = false;
            pmy[order_id]["sizel"] = false;
        } else {
            pmy[order_id]["vtypel"] = false;
            vlt_type = ""
        }
    });


    $(document).on("keyup", "#qty", async function (e) {
        var order_id = parseInt($(this).attr("data-id"));
        //console.log(e.which)
        if (e.which != 8 && isNaN(String.fromCharCode(e.which))) {
            e.preventDefault(); //stop character from entering input
        } else if (e.which == 8) {
            //console.log("delete")
        } else {
            let qty = $(this).val();
            det[order_id].qty = qty;
            var order_id = parseInt($(this).attr("data-id"));
            var id = order[order_id]["ID"];
            var res = await qtyAvailable(det[order_id].qty, id, det[order_id].vlt_type, pmy[order_id]["vtypel"]);
            det[order_id].vlt_id = res[2];
            //console.log(det)

            if (res[0]) {
                pmy[order_id]["qtyl"] = true
                order[order_id]["qty"] = det[order_id].qty;
                var alert = document.getElementsByClassName('alert')[0];
                if (alert) {
                    alert.classList.remove('show');
                }
            } else {
                pmy[order_id]["qtyl"] = false
                det[order_id].qty = 0;
                showError("danger", res[1], "error-section");
            }
        }

    });


    $(document).on("keyup", "#size", function (e) {
        var order_id = parseInt($(this).attr("data-id"));
        if (e.which != 8 && isNaN(String.fromCharCode(e.which))) {
            e.preventDefault(); //stop character from entering input
        } else if (e.which == 8) {
            //console.log("delete")
        } else {
            let size = $(this).val();
            det[order_id].size = size;
            var order_id = parseInt($(this).attr("data-id"));

            if (pmy[order_id]["vtypel"] == false) {
                showError("danger", "Please select a type first before entering size", "error-section");
            }
            else if (pmy[order_id]["qtyl"] == false) {
                showError("danger", "Please enetr a quantity first before entering size", "error-section");
            } else if (validFloat(size) == false) {
                showError("danger", "Invalid Input for size", "error-section");
            } else {
                var alert = document.getElementsByClassName('alert')[0];
                if (alert) {
                    alert.classList.remove('show');
                }
                pmy[order_id]["sizel"] = true;
                let s = order[order_id]["sell"];
                let p = parseFloat(size) * parseFloat(s);
                order[order_id]["price"] = p;

                RenderOrder(order);
            }
        }


    });


    $(document).on("change", "#qty", async function (e) {
        var order_id = parseInt($(this).attr("data-id"));
        var val = $(this).val();
        if (isNaN(val)) {
            e.preventDefault(); //stop character from entering input
        } else if (e.which == 8) {
            //console.log("delete")
        } else {
            let qty = $(this).val();
            det[order_id].qty = qty
            var order_id = parseInt($(this).attr("data-id"));
            var id = order[order_id]["ID"];
            var res = await qtyAvailable(det[order_id].qty, id, det[order_id].vlt_type, pmy[order_id]["vtypel"]);
            //console.log(res);
            if (res[0]) {
                pmy[order_id]["qtyl"] = true
                order[order_id]["qty"] = det[order_id].qty;
                var alert = document.getElementsByClassName('alert')[0];
                if (alert) {
                    alert.classList.remove('show');
                }
            } else {
                pmy[order_id]["qtyl"] = false
                det[order_id].qty = 0;
                showError("danger", res[1], "error-section");
            }
        }

    });


    $(document).on("change", "#size", function (e) {
        var order_id = parseInt($(this).attr("data-id"));
        var val = $(this).val();
        if (isNaN(val)) {
            e.preventDefault(); //stop character from entering input
        } else if (e.which == 8) {
            //console.log("delete")
        } else {
            let size = $(this).val();
            det[order_id].size = size;
            var order_id = parseInt($(this).attr("data-id"));

            if (pmy[order_id]["vtypel"] == false) {
                showError("danger", "Please select a type first before entering size", "error-section");
            }
            else if (pmy[order_id]["qtyl"] == false) {
                showError("danger", "Please enetr a quantity first before entering size", "error-section");
            } else if (validFloat(size) == false) {
                showError("danger", "Invalid Input for size", "error-section");
            } else {
                var alert = document.getElementsByClassName('alert')[0];
                if (alert) {
                    alert.classList.remove('show');
                }
                pmy[order_id]["sizel"] = true;
                let s = order[order_id]["sell"];
                let p = parseFloat(size) * parseFloat(s);
                order[order_id]["price"] = p;

                RenderOrder(order);
            }
        }


    });


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
        //console.log("here");
        var indx = 0;
        let g = [];


        pmy.forEach(function (ord) {
            //console.log(ord)
            if (ord.vtypel == false) {
                good = false
                showError("danger", "Please select a type first before proceeding to pay", "error-section");
                return
            }
            else if (ord.qtyl == false) {
                good = false
                showError("danger", "Please select a Quantity first before proceeding to pay", "error-section");
                return
            }
            else if (det[indx].size && validFloat(det[indx].size) == false) {
                good = false
                showError("danger", "Enter a valid Input for size first before proceeding to pay", "error-section");
                return
            } else {
                g.push(true)
            }
            indx += 1
        });

        if (g.length == order.length) {
            good = true;
        }

        if (totalPrice && totalPrice > 0 && order && order.length > 0 && good) {
            //console.log()
            RenderOrder(order, true);
            let py = "&#8358; " + subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
            $(".fw-normal").html("(" + py + ")");
            $(".cardy").html("Total: " + py);
            payModal.modal("show");
            amt_given = subTotal;
            change = 0
            //console.log("Amount Given is " + `${amt_given}`);
            //console.log("Change is  " + `${change}`);
        }

    });

    $("#given").on("keyup", function () {
        let given = parseFloat($(this).val()).toFixed(2);

        if (parseFloat(given) >= parseFloat(subTotal).toFixed(2)) {
            change = (given - subTotal).toFixed(2);
            $("#change").val(change);
        } else {
            //console.log("Not enough");
            $("#change").val("0");
        }
        //console.log("Amount Given is " + `${given}`);
        //console.log("Change is  " + `${change}`);
    });

    collect.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        amt_given = $("#given").val();
        change = $("#change").val();

        if (amt_given > subTotal) {
            status = change.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Change Paid";
            collected = true;
        } else {
            showError("danger", "Amount Tendered does not cover price of goods!", "alert");
        }
    });

    pay.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let state = $(this).attr("data-status");
        payment_type = $(this).attr("data-type");
        //console.log(order);
        let data = new FormData();
        let params = {};
        data.append("order", JSON.stringify(order));
        data.append("total", totalPrice);
        data.append("subTotal", subTotal);
        data.append("tax", tx);
        data.append("discount", disc);
        data.append("given", ((state && state == 'complete') ? subTotal : given));
        data.append("change", change);
        data.append("remark", status);
        data.append("state", ((state && state == 'complete') ? state : collected));
        data.append("payment_type", payment_type);
        data.append("det", JSON.stringify(det));
        data.append("type", "add");
        params.url = "/admin/add_sales";
        params.beforeSend = function () {
            swalShowLoading("New Order Record being created", "Please wait, while record is being created")
        };

        params.data = data;
        params.contentType = false;
        params.processData = false;
        params.type = "post";

        params.success = function (data) {
            if (data.success) {
                Swal.fire(data.success, "Click OK to proceed", "success").then(
                    function () {
                        let no = data.receipt_no;
                        let url = window.location.href + "/receipt/" + no
                        location.assign(url);
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

        if (good) {
            if ((state && state == "complete") || (collected)) {
                $.ajax(params);
            } else {
                showError("danger", "No Amount has been collected!", "alert");
            }
        }
    });







})