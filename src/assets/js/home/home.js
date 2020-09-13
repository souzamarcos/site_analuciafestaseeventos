class Home {

    constructor() {}
    static AtualizarBackroundNav() {
        if ($(window).scrollTop() >= ($('section.banner').height() - $('header >nav').height())) {
            $('header>nav').removeClass('transparente');
            $('header>nav').addClass('branco');
        } else {
            $('header>nav').removeClass('branco');
            $('header>nav').addClass('transparente');
        }
    }
}
