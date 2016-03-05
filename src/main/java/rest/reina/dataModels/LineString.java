package rest.reina.dataModels;

import java.util.ArrayList;

/**
 * Created by Daniel on 13/06/2015.
 */
public class LineString {

    private String type;
    private ArrayList<double[]> coordinates;

    public LineString(){};

    public LineString(ArrayList<double[]> coord){
        this.type = "LineString";
        this.coordinates = coord;
    };

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ArrayList<double[]> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(ArrayList<double[]> coordinates) {
        this.coordinates = coordinates;
    }
}
