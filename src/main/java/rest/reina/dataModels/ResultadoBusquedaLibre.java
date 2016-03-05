package rest.reina.dataModels;

/**
 * Created by Daniel on 18/05/2015.
 */
public class ResultadoBusquedaLibre {

    private String geojson;
    private String id;

    public ResultadoBusquedaLibre(){}

    public ResultadoBusquedaLibre(String geojson, String id){
        this.geojson = geojson;
        this.id = id;
    }

    public String getGeojson() {
        return geojson;
    }

    public void setGeojson(String geojson) {
        this.geojson = geojson;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
