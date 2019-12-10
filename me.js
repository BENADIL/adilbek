// JavaScript source code
$("menu a").on("click", function (event) {
    event.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
        scrollTop: $(hash).offset().top
    }, 800, function () {
        window.location.hash = hash;
    });
    
});

$(window).on("scroll", function () {
    $(".section").each(function () {
        var half = $(window).height() / 2;
        if ($(window).scrollTop() >= ($(this).offset().top - half)) {
            var id = $(this).attr("id");
            $("menu a").removeClass("active");
            $("menu a[href='#" + id + "']").addClass("active");
        }
    });
});
$(".summary").on("click", function () {
    var details = $(this).parent();
    var height = details.css("height");
    if (height == "55px") {
        details.css("height","");
    } else {
        details.css("height","55px");
    }
});
$(document).ready(function () {
    $(".details").css("height", "55px");
    
    var msPerYear = 60 * 1000 * 60 * 24 * 365;
    var msPerMonth = msPerYear / 12;

    var now = new Date();
    var birth = new Date(1981, 9, 18);
    $("#age").html(Math.round((now - birth) / msPerYear) + ' years');

    var since = new Date(2002, 4, 1);
    $("#total").html(Math.round((now - since) / msPerYear));


    var veriphone = new Date(2019, 3, 1);
    var months = Math.round((now - veriphone) / msPerMonth);
    var years = Math.floor(months / 12);
    months = months - (years * 12);
    var exp = (years > 0) ? (years + " years ") : "";
    if (months > 0) exp += months + " months";

    $("#current").html(exp);
});