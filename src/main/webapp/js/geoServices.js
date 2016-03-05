angular.module('starter')

    .service('geoService', function ($http, $ionicPopup, sharedProperties, APP_CONSTANTS) {

        var adaLayer = L.geoJson();
        var torresLayer = L.geoJson();
        var betanLayer = L.geoJson();
        var userPos = L.marker([0,0]);
        var estancia = L.geoJson();
        var ruta = L.geoJson();
        var map;
        var params;
        var viewparams;
        var piso;
        var group = new L.featureGroup;
        var favourites = [];
        var carIcon = L.icon({
            iconUrl: 'img/caricon.png',
            iconSize: [54,38],
            iconAnchor: [27,19]
        });
        var carPos = L.marker([0,0], {icon: carIcon});


        return ({
            placeBaseMap: placeBaseMap,
            placeBasePolygons: placeBasePolygons,
            placeBaseAda: placeBaseAda,
            placeBaseTorres: placeBaseTorres,
            placeBaseBetancourt: placeBaseBetancourt,
            placeFloor: placeFloor,
            getFloor: getFloor,
            removeOverlays: removeOverlays,
            locateUser: locateUser,
            busquedaLibre: busquedaLibre,
            calculaRuta: calculaRuta,
            pintarRutaContinuacion: pintarRutaContinuacion,
            clearRoute: clearRoute,
            sugerenciasEstancias: sugerenciasEstancias,
            goToBounds: goToBounds,
            getFavourites: getFavourites,
            goToCar: goToCar
        });

        function placeBaseMap() {

            //===========================//
            ////// LEAFLET INIT VARS //////
            //===========================//

            var MIN_ZOOM = 17;
            var INIT_ZOOM = 18;
            var MAX_ZOOM = 20;

            //Campus
            var MAP_LAT = 41.68337;
            var MAP_LON = -0.8883134;

            //===========================//
            ////// LEAFLET BASE MAP ///////
            //===========================//

            var Clean = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.{ext}', {
                subdomains: 'abcd',
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                ext: 'png',
                id: 'Clean'
            });

            var baseMaps = {
                "Clean": Clean
            };

            map = L.map('map-rioebro',
                {
                    zoomControl: false,
                    layers: [Clean]
                }).setView([MAP_LAT, MAP_LON], INIT_ZOOM);

            L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo(map);

            new L.Control.Zoom({position: 'bottomright'}).addTo(map);

            map.attributionControl.setPrefix('');

            //===========================//
            ///////// WORLD LIMIT /////////
            //===========================//

            /*map.bounds = [],
                map.setMaxBounds([
                    [41.6867518, -0.890032],
                    [41.6800233, -0.8819532]
                ]);*/

            var bounds = new L.latLngBounds([41.6867518, -0.890032], [41.6800233, -0.8819532]);
            map.fitBounds(bounds);

            map.on('contextmenu', handleMapClick);
            map.on('dblclick', saveCarPos);
            userPos.on('contextmenu', addToFavourites);

            params = {
                LAYERS: 'pgroutingtest:pgroutingtest',
                FORMAT: 'image/png'
            };
        };

        function placeBasePolygons() {
            $http.get("data/poligonosCampus.json")
                .success(function (data) {
                    L.geoJson(data, {
                        style: function (feature) {
                            return {weight: 1, color: "#565656", opacity: 0.50}
                        }
                    }).addTo(map);
                });
        };

        function placeBaseAda(floor) {
            $http.get("data/adaBase" + floor + ".json")
                .success(function (data) {
                    adaLayer.clearLayers();
                    adaLayer = L.geoJson(data, {
                        style: function (feature) {
                            return {weight: 1, color: "#18BFF2"}
                        },
                        onEachFeature: onEachFeature
                    });
                    adaLayer.addTo(map);
                }).error(function (data) {
                    adaLayer.clearLayers();
                    adaLayer.addTo(map);
                    console.log('no map');
                });
        };

        function placeBaseTorres(floor) {
            $http.get("data/torresBase" + floor + ".json")
                .success(function (data) {
                    torresLayer.clearLayers();
                    torresLayer = L.geoJson(data, {
                        style: function (feature, floor) {
                            return {weight: 1, color: "#E81515"}
                        },
                        onEachFeature: onEachFeature
                    });
                    torresLayer.addTo(map);
                }).error(function (data) {
                    torresLayer.clearLayers();
                    torresLayer.addTo(map);
                    console.log('no map');
                });
        };

        function placeBaseBetancourt(floor) {
            $http.get("data/betancourtBase" + floor + ".json")
                .success(function (data) {
                    betanLayer.clearLayers();
                    betanLayer = L.geoJson(data, {
                        style: function (feature) {
                            return {weight: 1, color: "#E67709"}
                        },
                        onEachFeature: onEachFeature
                    });
                    betanLayer.addTo(map);
                }).error(function (data) {
                    betanLayer.clearLayers();
                    betanLayer.addTo(map);
                    console.log('no map');
                });
        };

        function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.ID_CENTRO) {
                layer.bindPopup(feature.properties.ID_CENTRO);
                layer.on('contextmenu', handleMapClick);
            }
        };

        function placeFloor(floor) {
            piso = floor;
            placeBaseAda(floor);
            placeBaseTorres(floor);
            placeBaseBetancourt(floor);
        };

        function getFloor() {
            return piso;
        };

        function removeOverlays() {
            adaLayer.clearLayers();
            torresLayer.clearLayers();
            betanLayer.clearLayers();
            adaLayer.addTo(map);
            torresLayer.addTo(map);
            betanLayer.addTo(map);
        };

        function locateUser(){
            //map.on('locationfound', onLocationFound)
            userPos.addTo(map);
            //map.locate({setView: true, enableHighAccuracy: true, maxZoom: 20});
            navigator.geolocation.getCurrentPosition(onLocationFound, onLocationNotFound, {enableHighAccuracy: true})
        };

        function onLocationFound(position){
            var lat = (position.coords.latitude);
            var lng = (position.coords.longitude);
            var newLatLng = new L.LatLng(lat, lng);
            userPos.setLatLng(newLatLng);
        };

        function onLocationNotFound(){
            alert("Geolocation error");
        };

        function busquedaLibre(texto, edificio, piso, tipo) {
            $http.get(APP_CONSTANTS.URI_SERVICE+APP_CONSTANTS.BUSCAR_ESTANCIAS+texto+"/"+edificio+"/"+piso+"/"+tipo)
                .success(function (data) {
                    if (data.result){
                        showEmptyResultPopup();
                    } else {
                        console.log("Search result:",data);

                        estancia.clearLayers();
                        estancia = L.geoJson(JSON.parse(data.geojson), {
                            style: function (feature) {
                                return {weight: 1, color: "#000000"}
                            }
                        });
                        estancia.bindPopup(data.id);
                        map.addLayer(estancia);

                        //Centrar el mapa en la estancia
                        var coordinates  = JSON.parse(data.geojson).coordinates[0][0][0];
                        var coordinates_bis = [coordinates[1],coordinates[0]];
                        map.fitBounds([
                            coordinates_bis
                        ]);
                    }
                }).error(function (err) {
                    console.log(err);
            });
        };

        function calculaRuta(origen, destino, piso, ruta_corta){
            //todo
            console.log(origen, destino, piso, ruta_corta);
            $http.get(APP_CONSTANTS.URI_SERVICE+APP_CONSTANTS.CALCULAR_RUTAS+origen+"/"+destino+"/"+piso+"/"+ruta_corta)
                .success(function(data) {
                    console.log("CalculaRuta respuesta: ", data);
                    if (data.error){
                        showErrorRoutePopup(data.error);
                    } else {
                        if (data.type) {
                            ruta.clearLayers();
                            ruta = L.geoJson(data, {
                                style: function () {
                                    return {weight: 5, color: "#0DFF00", lineCap: "round", lineJoin: "round"}
                                }
                            });
                            map.addLayer(ruta);
                        } else {
                            ruta.clearLayers();
                            ruta = L.geoJson(data[0], {
                                style: function () {
                                    return {weight: 5, color: "#0DFF00", lineCap: "round", lineJoin: "round"}
                                }
                            });
                            map.addLayer(ruta);
                            showMultiRoutePopup(destino.split("-")[2].trim().charAt(1));

                            sharedProperties.setRuta(data[0],0);
                            sharedProperties.setRuta(data[1],1);
                            sharedProperties.setRutaPiso(origen.split("-")[2].trim().charAt(1),0);
                            sharedProperties.setRutaPiso(destino.split("-")[2].trim().charAt(1),1);
                        }
                    }
                });

           /*//"POINT(675803.307944167 4617040.36882526)"
           // "POINT(675854.408659714 4616998.66759351)"
            viewparams = [
                'x1:675803.307944167', 'y1:4617040.36882526',
                'x2:675854.408659714', 'y2:4616998.66759351'
            ];
            //params.viewparams = viewparams.join(';');
            //console.log(params.viewparams);
            var myLayer = L.tileLayer.wms("http://192.168.0.34:8080/geoserver/pgroutingtest/wms", {
                layers: 'pgroutingtest:pgroutingtest',
                format: 'json',
                transparent: true,
                version: '1.0.0',
                tiled:true,
                //attribution: params.viewparams
                x1:675803.307944167,
                y1:4617040.36882526,
                x2:675854.408659714,
                y2:4616998.66759351
            });
            console.log(myLayer);
            map.addLayer(myLayer);*/

        };

        function pintarRutaContinuacion(data){
            console.log("Pintar ruta continuacion");
            ruta.clearLayers();
            ruta = L.geoJson(data, {
                style: function () {
                    return {weight: 5, color: "#0DFF00", lineCap: "round", lineJoin: "round"}
                }
            });
            map.addLayer(ruta);
        }

        function clearRoute(){
            ruta.clearLayers();
        }

        function sugerenciasEstancias(){
            $http.get(APP_CONSTANTS.URI_SERVICE+APP_CONSTANTS.SUGERENCIAS_ESTANCIAS)
                .success(function(data){
                    sharedProperties.setSugerencias(data);
                    console.log("Sugerencias rutas: ",data);
                });
        };

        function goToBounds(lat,long){
            /*map.fitBounds([
                [lat,long]
            ]);*/
            var newLatLng = new L.LatLng(lat, long);
            userPos.setLatLng(newLatLng);
            userPos.addTo(map);
            map.setView(newLatLng,20);
        };

        function handleMapClick(e){
            console.log("Click on map", e.latlng);
            userPos.setLatLng(e.latlng);
            userPos.addTo(map);
            map.setView(e.latlng);
        };

        function addToFavourites(e){
            //var scope;
            //scope.name = null;
            console.log("Click on marker", this.getLatLng());
            var latLng = this.getLatLng();
            $ionicPopup.prompt({
                title: 'Nuevo favorito',
                inputType: 'text',
                inputPlaceholder: 'Nombre favorito'
            }).then(function(res){
                if(res == undefined) return;
                console.log("Fav name: ",res);
                favourites.push({
                    name: res,
                    lat: latLng.lat,
                    long: latLng.lng
                });
                $ionicPopup.alert({
                    title: "¡Agregada a favoritos!"
                });
            });
        };

        function getFavourites(){
            return favourites;
        };

        function saveCarPos(e){
            console.log("dblclick on map", e.latlng);
            carPos.setLatLng(e.latlng);
            carPos.addTo(map);
            //map.setView(e.latlng);
        };

        function goToCar(){
            map.setView(carPos.getLatLng(),20);
        };

        /*FUNCIONES DE POP-UP*/
        function showEmptyResultPopup() {
            var alertPopup = $ionicPopup.alert({
                title: 'No se han encontrado resultados'/*,
                 template: '<div id="warningTextPopup">Rellene los campos de texto<br>' +
                 'y edificio por favor</div>'*/
            });
            alertPopup.then(function() {});
        };

        function showMultiRoutePopup(piso) {
            var alertPopup = $ionicPopup.alert({
                title: '¡Advertencia!',
                template: '<div>La ruta continúa en otro piso, para<br>' +
                'visualizarla cambie a la Planta '+piso+'</div>'
            });
            alertPopup.then(function() {});
        };

        function showErrorRoutePopup(error) {
            var alertPopup = $ionicPopup.alert({
                title: '¡Error!',
                template: '<div>'+error+'</div>'
            });
            alertPopup.then(function() {});
        };
    });