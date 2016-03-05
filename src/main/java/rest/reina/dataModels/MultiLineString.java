package rest.reina.dataModels;

import java.util.ArrayList;

/**
 * Created by Daniel on 13/06/2015.
 */
public class MultiLineString {

    private String type;
    private ArrayList<ArrayList<double[]>> coordinates;

    public MultiLineString(){};

    public MultiLineString(ArrayList<ArrayList<double[]>> coord){
        this.type = "MultiLineString";
        this.coordinates = coord;
    };
}
