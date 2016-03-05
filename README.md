API
------

Directorio de servicios REST
=====

URI base: `http://host:port/reina/api`

| Verb | URI | Consumes | Response-Type | Definition |
|------------|--------------|--------------|-------------|------------|
| __GET__ | /buscar-clase/{texto}/{edificio}/{piso}/{estancia} | PathParams | application/geojson | Busca una estancia |
| __GET__ | /calcular-ruta/{origen}/{destino}/{piso}/{ruta_corta} | PathParams | application/geojson | Calcula una ruta |