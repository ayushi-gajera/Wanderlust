var map;
Mappls.accessToken = mapToken;
console.log(mapToken);
function loadMap() {
  map = new Mappls.Map("map", { center: [28.544, 77.5454] });
  map.addListener("load", function () {
    var marker = new Mappls.Marker({
      map: map,
      position: { lat: 28.544, lng: 77.5454 },
    });
  });
}
