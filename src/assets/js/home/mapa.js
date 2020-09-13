class Mapa {

    constructor(element) {
        this.mapa = null;
        this.markers = [];

        this.InicarMapa(element);
    }
    InicarMapa(element) {
        let self = this;

        self.mapa = new google.maps.Map(element, {
            zoom: 16,
            center: { lat: -22.5007214, lng: -44.1208134 },
            scrollwheel: false,
        });

        var marker = new google.maps.Marker({
            position: { lat: -22.5007214, lng: -44.1208134 },
            map: mapa,
            title: 'Ana Lúcia Festas e Eventos'
        });
        self.AddMarker(marker);
    }
    AddMarker(marker) {
        let self = this;
        marker.setMap(self.mapa);
    }
}