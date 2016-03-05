package bd;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


import javax.naming.Context;

import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;

public class ConnectionManager {
	
	static Context initContext;
	private final static String DRIVER_CLASS_NAME = "org.postgresql.Driver";
	private final static String DRIVER_URL = "jdbc:postgresql://localhost:5432/proyectodb";
	private final static String USER = "proyecto";
	private final static String PASSWORD = "proyectovm";//contrase�a de la BD
	private static DataSource datasource ;
	static {
		
		try {
			Class.forName(DRIVER_CLASS_NAME);
		} catch (ClassNotFoundException e) {
			e.printStackTrace(System.err);
		}

        PoolProperties p = new PoolProperties();
        p.setUrl("jdbc:postgresql://192.168.1.136:5432/proyectodb");
        p.setUrl("jdbc:postgresql://192.168.1.137:5432/pgroutingEINA");
        p.setDriverClassName("org.postgresql.Driver");
        p.setUsername("postgres");
        p.setPassword("postgres");//contrase�a de la BD
        p.setJmxEnabled(true);
        p.setTestWhileIdle(false);
        p.setTestOnBorrow(true);
        p.setValidationQuery("SELECT 1");
        p.setTestOnReturn(false);
        p.setValidationInterval(30000);
        p.setTimeBetweenEvictionRunsMillis(30000);
        p.setMaxActive(20);
        p.setInitialSize(10);
        p.setMaxWait(5000);
        p.setMaxIdle(10);
        p.setRemoveAbandonedTimeout(60);
        p.setMinEvictableIdleTimeMillis(30000);
        p.setMinIdle(10);
        p.setLogAbandoned(true);
        p.setRemoveAbandoned(true);
        p.setJdbcInterceptors(
          "org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"+
          "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer");
        
        datasource = new DataSource();
        datasource.setPoolProperties(p);

		
	}
	

	public static Connection getConnection() {
		try {
			return datasource.getConnection();
		} catch (SQLException e) {
			System.out.println("Driver no encontrado."); 
			e.printStackTrace();
		}
		return null;
	}
}