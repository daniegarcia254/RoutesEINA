package rest.reina;

import org.eclipse.persistence.jaxb.rs.MOXyJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class ApplicationConfig extends ResourceConfig{
	

    /**
     * Main constructor
     */
    public ApplicationConfig() {
    	register(LabISService.class);
    	register(MOXyJsonProvider.class);
    	register(CrossDomainFilter.class);
	}

}
