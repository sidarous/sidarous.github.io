$(document).ready(function(){
 
    // set up isotope
    $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

      
    var $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
    });

    $grid.imagesLoaded().progress( function() {
        $grid.isotope('layout');
    });
      

    // filter items on button click
    $('.filter-button-group').on( 'click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    $('.button-group').each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.currentbutton').removeClass('currentbutton');
            $( this ).addClass('currentbutton');
        });
    });

        //smooth scroll when click topnav from http://www.instantshift.com/2014/11/14/jquery-page-scroll-active-menu/
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        $('a').each(function () {
        $(this).removeClass('current');
    })
    $(this).addClass('current');
        var target = this.hash,
        menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 600, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });


    //On scroll event we are checking the position of elements against the scrolling amount as well as the sum of their height and position. On this basis we are adding and removing the active class of the menu items.
    function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('nav ul li a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('nav ul li a').removeClass("current");
                currLink.addClass("current");
            }
            else{
                currLink.removeClass("current");
            }
        });
    }


    
 });

//insert Google Map on page
function initMap() {
    var aPark = {lat: 41.684500, lng: -87.676502};
    var map = new google.maps.Map(
        document.getElementById('googleMap'), {zoom: 10, center: aPark});
    var marker = new google.maps.Marker({position: aPark, map: map});
}

