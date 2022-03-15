$(document).ready(function () {

    $('#sidebarToggle').on('click', function () {
        $(this).toggleClass('d-none');
        $('#sidebarToggle2').removeClass('d-none');

        $('#sidebarMenu').removeClass('col-lg-2');
        $('#sidebarMenu').toggleClass('col-lg-1');

        $('main').removeClass('col-lg-10');
        $('main').toggleClass('col-lg-11');

        $('#sidebarMenu ul li a').toggleClass('text-center');
        $('#sidebarMenu ul li a i').toggleClass('fs-5');
        $('#sidebarMenu ul li a span').toggleClass('d-none');

        $('#logo').removeClass('col-lg-2');
        $('#logo').toggleClass('col-lg-1');
    });


    $('#sidebarToggle2').on('click', function () {
        $(this).toggleClass('d-none');
        $('#sidebarToggle').removeClass('d-none');

        $('#sidebarMenu').removeClass('col-lg-1');
        $('#sidebarMenu').toggleClass('col-lg-2');

        $('main').removeClass('col-lg-11');
        $('main').toggleClass('col-lg-10');

        $('#sidebarMenu ul li a').removeClass('text-center');
        $('#sidebarMenu ul li a i').removeClass('fs-5');
        $('#sidebarMenu ul li a span').removeClass('d-none');

        $('#logo').removeClass('col-lg-1');
        $('#logo').toggleClass('col-lg-2');

        // $('#sidebarMenu ul li a i').toggleClass('text-danger');
    });


    $(document).on('click', '#full-screen', function () {
        $('#full-screen').toggleClass('d-none');
        $('#normal-screen').removeClass('d-none');

        $('header').toggleClass('d-none');
        $('#sideMenu').toggleClass('d-none');

        $('#pos').removeClass('col-lg-10');
        $('#pos').toggleClass('col-lg-12');

    });


    $(document).on('click', '#normal-screen', function () {
        $('#normal-screen').toggleClass('d-none');
        $('#full-screen').removeClass('d-none');

        $('header').removeClass('d-none');
        $('#sideMenu').removeClass('d-none');

        $('#pos').toggleClass('col-lg-10');
        $('#pos').removeClass('col-lg-12');


    });


});

var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}


function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}


// document.addEventListener("keyup", function (e) {
//     if (e.keyCode === 27) { // Escape
//         console.log('esc');
//     }
// });
