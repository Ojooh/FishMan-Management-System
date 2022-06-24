import { showError, swalShowLoading, isEmpty, validateNamey, validateName, validateTel, isImage } from './helper.js';

jQuery(document).ready(function ($) {
    let changed = false;
    var name = $("#company_name");
    var phone = $("#company_phone");
    var address = $("#address");
    var saveImg = $("#saveImg");
    var currency = $("#currency_name");
    var entity = $("#entity");
    var symbol = $("#symbol");
    var imgDisp = $("#imgDisplay");
    var modul = $(".module");
    var update = $(".update");
    var moduls = $(".modules");
    let namey = name.val();
    let phoney = phone.val();
    let addressy = address.val();
    let linky = imgDisp.attr("src");
    let currencyy = currency.val();
    let entityy = entity.val();
    let symboly = symbol.val();
    let perm;

    function setCheckedPerm() {
        var perms = $("#rolesy").attr("data-perm");
        perm = JSON.parse(perms);
        console.log(perm);

        if (Object.keys(perm).length > 0) {
            Object.keys(perm).forEach(function (key) {
                let v = perm[key];

                v.forEach(function (item) {
                    let elemt = "#" + key + " ." + item;
                    console.log(elemt);
                    $(elemt).attr("checked", "checked");
                });
            });
        }
    }

    name.on("focusout", function () {
        if ($(this).val() != namey) {
            changed = true;
        }

    });

    phone.on("focusout", function () {
        if ($(this).val() != phoney) {
            changed = true;
        }

    });

    address.on("focusout", function () {
        if ($(this).val() != addressy) {
            changed = true;
        }

    });

    saveImg.on("focusout", function () {
        if (imgDisp.attr("src") != linky) {
            console.log(imgDisp.attr("src"));
            changed = true;
        }

    });

    currency.on("focusout", function () {
        if ($(this).val() != currencyy) {
            changed = true;
        }

    });

    entity.on("focusout", function () {
        if ($(this).val() != entityy) {
            changed = true;
        }

    });

    symbol.on("focusout", function () {
        if ($(this).val() != symboly) {
            changed = true;
        }

    });

    modul.on("click", function () {
        let id = "#" + $(this).attr("for");
        changed = true;
        if ($(id)[0].checked == false) {
            changed = true
        }
    })

    update.on("click", function (e) {
        let cat = $(this).attr("data-status");
        let errorClass = "error-sett-" + cat;
        let params = {};
        let data = new FormData();
        params.contentType = false;
        params.processData = false;
        params.type = "post";
        params.url = "/admin/update_settings"
        params.beforeSend = function () {
            swalShowLoading("Updating System Settings", "Please wait, while system settings are being updated")
        };
        console.log(changed);
        console.log(cat);

        if (changed && cat == "bio") {
            let comp_name = name.val();
            let comp_phone = phone.val();
            let comp_address = address.val();
            let comp_img = saveImg[0].files[0];
            if (isEmpty(comp_name) || validateNamey(comp_name) == false) {
                showError("danger", "Company Name is Invalid", errorClass);
            } else if (isEmpty(comp_phone) || validateTel(comp_phone) == false) {
                showError("danger", "Company phone is Invalid", errorClass);
            } else if (isEmpty(comp_address) || validateNamey(comp_address) == false) {
                showError("danger", "Company address is Invalid", errorClass);
            } else if (comp_img != undefined && isImage(comp_img) == false) {
                showError("danger", "Company Logo is Invalid", errorClass);
            } else {
                data.append("comp_name", comp_name);
                data.append("comp_phone", comp_phone);
                data.append("comp_address", comp_address);
                data.append("link", comp_img);
                data.append("cat", cat);
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

        }
        else if (changed && cat == "role") {
            let samp = {};
            let ray = [];

            moduls.each(function (item) {
                console.log(samp);
                if (samp[$(this).attr("data-user")]) {
                    if ($(this)[0].checked) {
                        // console.log(samp[$(this).attr("data-user")]);
                        ray.push($(this).attr("data-value"));
                        samp[$(this).attr("data-user")] = ray;
                    }
                } else {
                    if ($(this)[0].checked) {
                        ray = [];
                        ray.push("dash");
                        ray.push($(this).attr("data-value"));
                        samp[$(this).attr("data-user")] = ray
                    }
                }

            });


            data.append("perms", JSON.stringify(samp));
            data.append("cat", cat);
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
        else if (changed && cat == "currency") {
            let curr_name = currency.val();
            let entit = entity.val();
            let symbo = symbol.val();
            if (isEmpty(curr_name) || validateName(curr_name) == false) {
                showError("danger", "Currency Name is Invalid", errorClass);
            } else if (isEmpty(entit)) {
                showError("danger", "Currency Entity is Invalid", errorClass);
            } else if (isEmpty(symbo) || validateName(symbo) == false) {
                showError("danger", "Currency Symbol is Invalid", errorClass);
            } else {
                data.append("curr_name", curr_name);
                data.append("entity", entit);
                data.append("symbol", symbo);
                data.append("cat", cat);
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

        }
    })



    setCheckedPerm();
});