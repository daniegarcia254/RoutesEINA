package rest.reina;

import java.awt.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import bd.ConnectionManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import rest.reina.dataModels.LineString;
import rest.reina.dataModels.MultiLineString;
import rest.reina.dataModels.ResultadoBusquedaLibre;

/**
 * 
 * Servicio RESTful para LabIS
 *
 */

@Path("/")
public class LabISService {
	
	
	/**
	 * Devuelve el listado de incidencias que aparecen en la página web del Centro
	 * Universitario de Lenguas Modernas.
	 *
     * @param texto String
     * @param edificio [1,3]
     * @param piso [-1,4]
     * @param estancia tipo de estancia [1,4]
	 * @return estancias encontradas que cumplen los parámetros de entrada
	 */
	@Path("/buscar-clase/{texto}/{edificio}/{piso}/{estancia}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String buscarClase(@PathParam("texto") String texto, @PathParam("edificio") int edificio,
							  @PathParam("piso") int piso, @PathParam("estancia") int estancia) {
		
		Gson gson = new Gson();

		try{
            Connection c = ConnectionManager.getConnection();
            String queryString = "SELECT ST_AsGeoJSON(ST_Transform(the_geom,4326)), id_centro FROM public.";

			switch (edificio){
                case 1:
                    queryString += "adabyron_"; break;
                case 2:
                    queryString += "torresquevedo_"; break;
                case 3:
                    queryString += "betancourt_"; break;
            }

            switch (piso) {
                case -1:
                    queryString += "ps WHERE id_centro LIKE '%"+texto.trim().toUpperCase()+"%'";
                    break;
                default:
                    queryString += "p" + piso +
                            " WHERE id_centro LIKE '%" + texto.trim().toUpperCase() + "%'";
                    break;
            }

            switch (estancia){
				case 1:
					queryString += " AND id_centro LIKE '%LAB%'";
					break;
				case 2:
					queryString += " AND id_centro LIKE '%AULA%'";
					break;
				case 3:
					queryString += " AND id_centro LIKE '%DESPACHO%'";
					break;
                case 4:
                    // cualquiera
                    break;
			}

            queryString += " ORDER BY st_asgeojson LIMIT 1";

            System.out.println(queryString);
            PreparedStatement preparedStatement = c.prepareStatement(queryString);
            ResultSet rs = preparedStatement.executeQuery();

            String response = "";
            if(rs.next()){
				ResultadoBusquedaLibre result = new ResultadoBusquedaLibre(
						rs.getString("st_asgeojson"), rs.getString("id_centro"));
				response = gson.toJson(result, ResultadoBusquedaLibre.class);
            } else {
                response = "{\"result\":\"empty\"}";
            }
			c.close();
			return response;
			
		} catch (Exception e){
			System.err.println(e);
            return gson.toJson(null);
		}
	}

    /**
     *
     *
     * @param origen punto de origen String
     * @param destino punto de detino String
     * @param piso [1,3]
     * @param ruta_corta true si se desea la ruta más corta, false si no
     * @return ok
     */
    @Path("/calcular-ruta/{origen}/{destino}/{piso}/{ruta_corta}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String calculaRuta(@PathParam("origen") String origen, @PathParam("destino") String destino,
                              @PathParam("piso") int piso, @PathParam("ruta_corta") boolean ruta_corta){

        Double origX=0.0, origY=0.0, destX=0.0, destY=0.0;
        Double escalerasX = 675837.87;
        Double escalerasY = 4617053.77;
        String response = "";

        Gson gson = new Gson();

        try{
            Connection c = ConnectionManager.getConnection();
            String queryStringOrigen = "SELECT ST_AsText(ST_Centroid(the_geom)) FROM ";
            String queryStringDestino = "SELECT ST_AsText(ST_Centroid(the_geom)) FROM ";

            String edificio_origen = origen.split("-")[1].trim();
            String edificio_origen_piso = String.valueOf(origen.split("-")[2].trim().charAt(1));
            String edificio_destino = destino.split("-")[1].trim();
            String edificio_destino_piso = String.valueOf(destino.split("-")[2].trim().charAt(1));

            /*switch (edificio_origen){
                case "A.Byron":
                    queryStringOrigen += "public.adabyron_p"+edificio_origen_piso; break;
                case "T.Quevedo":
                    queryStringOrigen += "public.torresquevedo_p"+edificio_origen_piso; break;
                case "Betancourt":
                    queryStringOrigen += "public.betancourt_p"+edificio_origen_piso; break;
            }

            switch (edificio_destino){
                case "A.Byron":
                    queryStringDestino += "public.adabyron_p"+edificio_destino_piso; break;
                case "T.Quevedo":
                    queryStringDestino += "public.torresquevedo_p"+edificio_destino_piso; break;
                case "Betancourt":
                    queryStringDestino += "public.betancourt_p"+edificio_destino_piso; break;
            }

            queryStringOrigen += " WHERE id_centro LIKE '%" + origen.split("-")[0].trim() + "%' ORDER BY st_astext LIMIT 1";
            queryStringDestino += " WHERE id_centro LIKE '%" + destino.split("-")[0].trim() + "%' ORDER BY st_astext LIMIT 1";*/

            if (edificio_origen_piso.compareTo(edificio_destino_piso) != 0) {

                    queryStringOrigen += "public.adabyron_p0, (SELECT id_centro_p0 " +
                                "FROM relaciones_pisos_abyron " +
                                "WHERE id_centro_px LIKE '%"+origen.split("-")[0].trim()+"%' AND piso="+edificio_origen_piso+") AS nombre " +
                            "WHERE id_centro=nombre.id_centro_p0 ORDER BY st_astext LIMIT 1";

                queryStringDestino += "public.adabyron_p0, (SELECT id_centro_p0 " +
                            "FROM relaciones_pisos_abyron " +
                            "WHERE id_centro_px LIKE '%"+destino.split("-")[0].trim()+"%' AND piso="+edificio_destino_piso+") AS nombre " +
                            "WHERE id_centro=nombre.id_centro_p0 ORDER BY st_astext LIMIT 1";

            } else {
                queryStringOrigen += "public.adabyron_p"+edificio_origen_piso+
                        " WHERE id_centro LIKE '%" + origen.split("-")[0].trim() + "%' ORDER BY st_astext LIMIT 1";
                queryStringDestino += "public.adabyron_p"+edificio_destino_piso+
                        " WHERE id_centro LIKE '%" + destino.split("-")[0].trim() + "%' ORDER BY st_astext LIMIT 1";
            }

            System.out.println("Query estancia Origen: " + queryStringOrigen);
            System.out.println("Query estancia Destino: " + queryStringDestino);

            PreparedStatement preparedStatement = c.prepareStatement(queryStringOrigen);
            ResultSet rs = preparedStatement.executeQuery();

            if(rs.next()){
                String p = rs.getString("st_astext").split("\\(")[1];
                origX = Double.valueOf(p.split(" ")[0]);
                String y = p.split(" ")[1];
                origY = Double.valueOf(y.substring(0, y.length()-1));
            } else {
                response = "{\"error\":\"Error al calcular la ruta<br>Origen desconocido\"}";
                return response;
            }

            preparedStatement = c.prepareStatement(queryStringDestino);
            rs = preparedStatement.executeQuery();

            response = "";
            if(rs.next()){
                String p = rs.getString("st_astext").split("\\(")[1];
                destX = Double.valueOf(p.split(" ")[0]);
                String y = p.split(" ")[1];
                destY = Double.valueOf(y.substring(0, y.length()-1));
            } else {
                response = "{\"error\":\"Error al calcular la ruta<br>Destino desconocido\"}";
                return response;
            }

            if (edificio_origen_piso.compareTo(edificio_destino_piso) != 0){

                String queryStringRuta1 = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 23030),4326)) " +
                        "FROM pgr_fromatob('ways',"+origX +","+origY+","+escalerasX+","+escalerasY+")";

                preparedStatement = c.prepareStatement(queryStringRuta1);
                rs = preparedStatement.executeQuery();

                response = "";
                ArrayList<ArrayList<double[]>> lineas1 = new ArrayList<ArrayList<double[]>>();
                while(rs.next()){
                    LineString line = gson.fromJson( rs.getString("st_asgeojson"), LineString.class );
                    lineas1.add(line.getCoordinates());
                }

                MultiLineString ruta1 = new MultiLineString(lineas1);

                String queryStringRuta2 = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 23030),4326)) " +
                        "FROM pgr_fromatob('ways',"+escalerasX +","+escalerasY+","+destX+","+destY+")";

                preparedStatement = c.prepareStatement(queryStringRuta2);
                rs = preparedStatement.executeQuery();

                response = "";
                ArrayList<ArrayList<double[]>> lineas2 = new ArrayList<ArrayList<double[]>>();
                while(rs.next()){
                    LineString line = gson.fromJson( rs.getString("st_asgeojson"), LineString.class );
                    lineas2.add(line.getCoordinates());
                }

                MultiLineString ruta2 = new MultiLineString(lineas2);

                ArrayList<MultiLineString> rutas = new ArrayList<MultiLineString>();
                rutas.add(ruta1);
                rutas.add(ruta2);

                response = gson.toJson(rutas, ArrayList.class);

            } else {
                String queryStringRuta = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 23030),4326)) " +
                        "FROM pgr_fromatob('ways',"+origX +","+origY+","+destX+","+destY+")";

                preparedStatement = c.prepareStatement(queryStringRuta);
                rs = preparedStatement.executeQuery();

                response = "";
                ArrayList<ArrayList<double[]>> lineas = new ArrayList<ArrayList<double[]>>();
                while(rs.next()){
                    LineString line = gson.fromJson( rs.getString("st_asgeojson"), LineString.class );
                    lineas.add(line.getCoordinates());
                }

                MultiLineString ruta = new MultiLineString(lineas);
                response = gson.toJson(ruta, MultiLineString.class);
            }

            c.close();
            return response;

        } catch (Exception e){
            System.err.println(e);
            return gson.toJson("{\"error\":\""+e.getMessage()+"\"}");
        }
    }

    /**
     *
     * @return lista de estancias disponibles en un piso para los tres edificios
     */
    @Path("/sugerencias-estancias")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String sugerenciasEstancias(){

        Gson gson = new Gson();

        try{
            Connection c = ConnectionManager.getConnection();

            String queryStringAda = "", queryStringTorres = "", queryStringBetancourt = "";
            /*String where =  " WHERE id_centro NOT LIKE '%PASILLO%' AND id_centro NOT LIKE '%RELLANO%' " +
                    "AND id_centro NOT LIKE '%RACK%' AND id_centro NOT LIKE '%HUECO%' AND id_centro NOT LIKE '%CUADRO%' " +
                    "AND id_centro NOT LIKE '%CLIMATIZACION%' AND id_centro NOT LIKE '%SUBESTACION%' AND id_centro NOT LIKE '%JETAI%'";*/
            String where = " WHERE id_centro LIKE '%AULA%' OR id_centro LIKE '%DESPACHO%' OR id_centro LIKE '%CAFETE%' " +
                    "OR id_centro LIKE '%TALLER%' OR id_centro LIKE '%LAB%' OR id_centro LIKE '%SEMINARIO%'";

            String queryString = "SELECT DISTINCT estancia FROM(" +
                    /*"SELECT (id_centro || ' - A.Byron - Bajo') as estancia FROM public.adabyron_ps"+where+
                    " UNION ALL " +
                    "SELECT (id_centro || ' - T.Quevedo - Bajo') as estancia FROM public.torresquevedo_ps"+where+
                    " UNION ALL " +*/
                    "SELECT (id_centro || ' - A.Byron - P0') as estancia FROM public.adabyron_p0"+where+
                    " UNION ALL " +
                    /*"SELECT (id_centro || ' - T.Quevedo - P0') as estancia FROM public.torresquevedo_p0"+where+
                    " UNION ALL " +
                    "SELECT (id_centro || ' - Betancourt - P0') as estancia FROM public.betancourt_p0"+where+
                    " UNION ALL " +*/
                    "SELECT (id_centro || ' - A.Byron - P1') as estancia FROM public.adabyron_p1"+where+
                    " UNION ALL " +
                    /*"SELECT (id_centro || ' - T.Quevedo - P1') as estancia FROM public.torresquevedo_p1"+where+
                    " UNION ALL " +
                    "SELECT (id_centro || ' - Betancourt - P1') as estancia FROM public.betancourt_p1"+where+
                    " UNION ALL " +*/
                    "SELECT (id_centro || ' - A.Byron - P2') as estancia FROM public.adabyron_p2"+where+
                    " UNION ALL " +
                    /*"SELECT (id_centro || ' - T.Quevedo - P0') as estancia FROM public.torresquevedo_p2"+where+
                    " UNION ALL " +
                    "SELECT (id_centro || ' - Betancourt') as estancia FROM public.betancourt_p2"+where+
                    " UNION ALL " +*/
                    "SELECT (id_centro || ' - A.Byron - P3') as estancia FROM public.adabyron_p3"+where+/*
                    " UNION ALL " +
                    "SELECT (id_centro || ' - T.Quevedo - P3') as estancia FROM public.torresquevedo_p3"+
                    " UNION ALL " +
                    "SELECT (id_centro || ' - A.Byron - P4') as estancia FROM public.adabyron_p4"+where+*/") as estancias ORDER BY estancia ASC";

            System.out.println(queryString);

            ArrayList<String> estancias = new ArrayList<String>();
            PreparedStatement preparedStatement;

            preparedStatement = c.prepareStatement(queryString);
            ResultSet rs = preparedStatement.executeQuery();
            while(rs.next()) {
                estancias.add(rs.getString("estancia"));
            }

            c.close();
            return gson.toJson(estancias, ArrayList.class);

        } catch (Exception e){
            System.err.println(e);
            return gson.toJson(null);

        }
    }
}
