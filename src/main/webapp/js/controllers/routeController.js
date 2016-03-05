angular.module('starter')

    .controller('RouteCtrl', function($scope, $rootScope, geoService, sharedProperties, $ionicPopup){
        $scope.origen = null;
        $scope.destino = null;
        $scope.ruta_corta = false;
        $scope.sugerencias = [];

        $scope.showSearchAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Campos de ruta vacíos',
                template: '<div id="warningTextPopup">Rellene los campos de origen<br>' +
                'y destino por favor</div>'
            });
            alertPopup.then(function() {});
        };

        $scope.busquedaRuta = function(){
            console.log("Origen: ", $scope.origen);
            console.log("Destino: ", $scope.destino);
            console.log("Piso: ", geoService.getFloor());
            console.log("Ruta corta? ", $scope.ruta_corta);
            if($scope.origen == null || $scope.origen == "" || $scope.destino == null || $scope.destino == ""){
                $scope.showSearchAlert();
            }else{
                console.log("Realizar calculaRuta");
                geoService.calculaRuta($scope.origen,$scope.destino,geoService.getFloor(),$scope.ruta_corta);
            }
        };

        $scope.items = [];
        $scope.sugerencias = sharedProperties.getSugerencias();

        $scope.sugerencias.forEach(function(item){
            $scope.items.push({'display':item});
        })

        $scope.onSelectOrigin = function(item){
            console.log(item);
            $scope.origen = item.display;
        };

        $scope.onSelectDestination = function(item){
            console.log(item);
            $scope.destino = item.display;
        };

        $scope.showInfoRutaPopup = function(){
            $scope.infoRutaPopup = $ionicPopup.alert({
                title: 'Información',
                template: '<div>La búsqueda de rutas es, de forma temporal, únicamente ' +
                'funcional para el edificio A.Byron y para algunas de las estancias.<br></div>',
                scope: $scope
            });
        };
    });
