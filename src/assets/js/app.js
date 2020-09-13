//bibliotecas externas
// window.$ = window.jQuery = require('jquery')
// require('bootstrap-sass');
let mapa = null;

function iniciarMapa() {
    mapa = new Mapa(document.getElementsByClassName('map').item(0));
}

var images = null;
var displayedImages = 0;
var buscarFotos = () =>{
	$('.fotos-galeria .loading').show();
	if(!images) {
		$.ajax({
			url: "fotos.json",
			method: 'GET',
			dataType: "json",
		}).done(function(response) {		
			if(response.data){
				images = response.data
			}
			exibirFotos()
			$('.btn-buscar-mais').hide();
		});
	} else {
		setTimeout(function() {
			exibirFotos()
			$('.btn-buscar-mais').hide();
		}, 300)
	}
}

var exibirFotos = () =>{
	if(images){
		//todo fazer "paginação"
		images.forEach(function(item){
			$('.galeria').append('<figure class="foto" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"><a href="assets/img/fotos/' + item.nome + '" itemprop="contentUrl" data-size="' + item.width + 'x' + item.height + '"><img src="assets/img/fotos/thumbnail/' + item.nome + '" itemprop="thumbnail" alt="" /></a><figcaption itemprop="caption description"></figcaption></figure>');
        });
        $('.fotos-galeria .loading').hide();
	}
}

var loadGoogleMaps = () => {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src  = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCPmN8z-_VHhh7zMK_0v0Mvz3F_vi7C1jg&callback=iniciarMapa";
    $("head").append(scriptElement);  
}

$(document).ready(function() {

    $('body').on('click', '.open-menu', function(event) {
        $('header>nav').toggleClass('open');
        $('body').toggleClass('nav-open');
    });

    $('.carousel').carousel({
        interval: 3000
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('header nav').on('click', 'a[href*="#"]', function() {
        $('header nav').removeClass('open');
        $('body').removeClass('nav-open');
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 900);
        return false;
    });

    let lastScrollTop = 0;
    $(window).scroll(function(event) {

        if ($(window).scrollTop() > Home.lastScrollTop && $(window).scrollTop() > $('body > header nav').height()) {
            // downscroll code
            $('header>nav').removeClass('active');
        } else {
            // upscroll code
            $('header>nav').addClass('active');
        }

        Home.lastScrollTop = $(window).scrollTop();

    });

    loadGoogleMaps()
});
