angular.module('starter')

    .controller('HomeCtrl', function ($scope, $rootScope, geoService, sharedProperties, $ionicPopup, $window, APP_CONSTANTS) {

        ///////////////////////

        $scope.pisos = [
            {id: 0, text: 'Sótano', checked: false, icon: null},
            {id: 1, text: 'Planta calle', checked: false, icon: null},
            {id: 2, text: 'Planta 1', checked: false, icon: null},
            {id: 3, text: 'Planta 2', checked: true, icon: null},
            {id: 4, text: 'Planta 3', checked: true, icon: null},
            {id: 5, text: 'Planta 4', checked: true, icon: null}];

        //$scope.pisos_texto = 'Elige planta';
        $rootScope.piso = $scope.pisos[1].id;
        $scope.val =  {single: $scope.pisos[1].id};
        $scope.pisos_texto = $scope.pisos[1].text;

        ///////////////////////

        $scope.locateUser = function(){
            console.log("called");
            geoService.locateUser();
        };

        $scope.placeFloor = function(piso){
            $rootScope.piso = piso -1;
            geoService.placeFloor(piso-1);

            pisoRuta = sharedProperties.getRutaPiso();
            rutas = sharedProperties.getRuta();

            if (pisoRuta[0] === $rootScope.piso){
                geoService.pintarRutaContinuacion(rutas[0]);
            } else if (pisoRuta[1] === $rootScope.piso){
                geoService.pintarRutaContinuacion(rutas[1]);
            } else {
                geoService.clearRoute();
            }
        };

        geoService.placeBaseMap();
        geoService.placeFloor(0);

        /*----------------------------------------------*/
        /*----------- POPUP FAVORITOS -------------*/
        $scope.showCarPos = function(){
            geoService.goToCar();
        };

        $scope.showPopupFavoritos = function() {

            $scope.favs = geoService.getFavourites();

            $scope.favoritosPopup = $ionicPopup.show({
                templateUrl: 'templates/favoritos-popup.html',
                scope: $scope
            });
        };

        $scope.closeFavPopup = function(){
            $scope.favoritosPopup.close();
        };

        $scope.showFavPos = function(index) {
            geoService.goToBounds($scope.favs[index].lat,$scope.favs[index].long);
            $scope.favoritosPopup.close();
        };

        /*----------------------------------------------*/
        /*----------- POPUP MENÚS CAFETERÍAS --------- */
        /*----------------------------------------------*/
        $scope.showPopupCafeterias = function() {
            $scope.cafeteriaPopup = $ionicPopup.show({
                templateUrl: 'templates/cafeteria-popup.html',
                scope: $scope
            });
        };

        $scope.closeCafePopup = function() {
            $scope.cafeteriaPopup.close();
        };

        $scope.downloadMenu = function(data){
            switch (data){
                case 1:
                    //cafeteriaService.downloadMenu("ADA_BYRON_2_8FEBRERO2015.pdf");
                    $window.open(APP_CONSTANTS.cafeterias_URI + APP_CONSTANTS.ADA_PDF, '_system');
                    $scope.cafeteriaPopup.close();
                    break;
                case 2:
                    $window.open(APP_CONSTANTS.cafeterias_URI + APP_CONSTANTS.TORRES_PDF, '_system');
                    $scope.cafeteriaPopup.close();
                    break;
                case 3:
                    $window.open(APP_CONSTANTS.cafeterias_URI + APP_CONSTANTS.BETAN_PDF, '_system');
                    $scope.cafeteriaPopup.close();
                    break;
            }
        }
    });
