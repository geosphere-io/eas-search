var incidentService = (function(window, $) {

    var INCIDENTS_API_JSON_URL = resourceEndpointsModule.INCIDENTS_API_JSON_URL;

    function _findMostRecentIncident(callback) {
        var query = "?$select=*"
          + "&$limit=1"

        $.get(INCIDENTS_API_JSON_URL + query, function(data) {
            callback(data[0]);
        });
    }

    function _findAllWithoutGeoParam(searchParams, callback) {
        var query = _buildAllDataQuery(searchParams);
        $.get(INCIDENTS_API_JSON_URL + query, callback);
    }

    function _buildAllDataQuery(params) {
        return "?$select=*"
          + "&$limit=10000";
    }

    function _findIncidentsWithPolygonSearch(searchParams, callback) {
        var query = _buildPolygonIncidentDataQuery(searchParams);
        $.get(INCIDENTS_API_JSON_URL + query, callback);
    }

    function _buildPolygonIncidentDataQuery(params) {
        var wellKnownTextPolygon = _buildWellKnownTextFromGeoJson(params.searchGeoJson);

        return "?$select=*"
          + "&$where="
          + " within_polygon(location, \'" + wellKnownTextPolygon + "\')"
          + "&$limit=10000";
    }

    function _buildWellKnownTextFromGeoJson(geoJson) {
        var coordinates = geoJson.geometry.coordinates[0].map(function(coord) {
            return coord.join(' ');
        }).join(', ');

        return 'MULTIPOLYGON (((' + coordinates + ')))';
    }

    function _findIncidentsWithRadialSearch(searchParams, callback) {
        var query = _buildRadialIncidentDataQuery(searchParams);
        $.get(INCIDENTS_API_JSON_URL + query, callback);
    }

    function _buildRadialIncidentDataQuery(params) {
        return "?$select=*"
          + "&$where="
          + " within_circle(location," +  params.latitude + "," + params.longitude + "," + params.searchRadius + ")"
          + "&$limit=10000";
    }

    return {
        findMostRecentIncident: _findMostRecentIncident,
        findIncidentsWithPolygonSearch: _findIncidentsWithPolygonSearch,
        findIncidentsWithRadialSearch: _findIncidentsWithRadialSearch,
        findAllWithoutGeoParam: _findAllWithoutGeoParam,
        buildPolygonIncidentDataQuery: _buildPolygonIncidentDataQuery,
        buildRadialIncidentDataQuery: _buildRadialIncidentDataQuery,
        buildAllDataQuery: _buildAllDataQuery
    };

})(window, jQuery);

