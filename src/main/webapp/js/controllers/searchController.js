angular.module('starter')

    .controller('SearchCtrl', function($scope, geoService, $ionicPopup){

        $scope.texto = null;
        $scope.edificio = null;
        $scope.estancia = {
            tipo: "4"
        };

        $scope.edificios = [
            {
                id: 1,
                nombre: "Ada Byron"
            },
            {
                id: 2,
                nombre: "Torres Quevedo"
            },
            {
                id: 3,
                nombre: "Betancourt"
            }
        ];
        $scope.edificio = $scope.edificios[0];

        $scope.showSearchAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Campos de búsqueda vacíos',
                template: '<div id="warningTextPopup">Rellene el campo de texto<br>' +
                'por favor</div>'
            });
            alertPopup.then(function() {});
        };

        $scope.busquedaLibre = function(){
            console.log("Texto: ", $scope.texto);
            console.log("Edificio: ", $scope.edificio.id);
            console.log("Piso: ", geoService.getFloor());
            console.log("Estancia: ", $scope.estancia.tipo);
            if ($scope.texto === null || $scope.texto==""){
                $scope.showSearchAlert();
            } else {
                console.log("Realizar busquedaLibre");
                geoService.busquedaLibre($scope.texto, $scope.edificio.id, geoService.getFloor(), $scope.estancia.tipo);
            }
        }
    });
