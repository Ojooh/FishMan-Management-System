var date_range = $("#daterange");
var printBtn = $("#printReportBtn");
var exportBtn = $("#exportBtn");
var report = $('#printReport');
var showey = $('.showey');
let u = window.location.href.split("/")
const url = u.slice(2, 6).join("/")
let header = ((u && u[0] == 'http:' ? 'http://' : 'https://'))


jQuery(document).ready(function ($) {
    let urln = window.location.href.split("?dates=");
    console.log(urln)
    if (urln && urln.length > 1) {
        date_range.val(urln[1].replace(/%20/g, ' '));
    }
});

function generatePDF() {
    const element = document.getElementById('printReport').innerHTML;
    html2pdf().from(element).save();
}

date_range.on("change", function (e) {
    let val = $(this).val();
    let dates = val.split("-")
    let date_1 = dates[0].trim().split("/");
    let date_2 = dates[1].trim().split("/");
    // Y - M - D
    let new_date_1 = date_1[2] + '-' + date_1[0] + '-' + date_1[1];
    let new_date_2 = date_2[2] + '-' + date_2[0] + '-' + date_2[1];
    let urly = header + url + '/' + new_date_1 + ',' + new_date_2 + "?dates=" + val;
    location.assign(urly);

});

showey.on('click', function (e) {
    let name = $(this).attr("data-name");
    let id = $(this).attr("data-id");

    let key = ".show-" + id;
    console.log(key)
    $("#staticBackdropLabel").html("Sales for " + name);
    $(".show").addClass("d-none");
    $(key).removeClass("d-none");
})

// print general report
printBtn.on("click", function () {
    var printContents = report.html();
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
});

// print day report
document.getElementById("printDayReportBtn").addEventListener("click", function () {
    var printContents = document.getElementById('printDayReport').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    // window.close();
});

    // export general report as pdf
