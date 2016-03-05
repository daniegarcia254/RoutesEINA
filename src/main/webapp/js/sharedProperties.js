angular.module('starter')

    .service('sharedProperties', function () {

        var sugerencias = [];
        var ruta = [];
        var ruta_piso = [];

        return ({
            getSugerencias: getSugerencias,
            setSugerencias: setSugerencias,
            getRuta: getRuta,
            setRuta: setRuta,
            getRutaPiso: getRutaPiso,
            setRutaPiso: setRutaPiso
        });

        function getSugerencias(){
            return sugerencias;
        };

        function setSugerencias(data){
            sugerencias = data;
        }

        function getRuta(){
            return ruta;
        };

        function setRuta(data, index){
            ruta[index] = data;
        }

        function getRutaPiso(){
            return ruta_piso;
        };

        function setRutaPiso(data, index){
            ruta_piso[index] = data;
        }
    });