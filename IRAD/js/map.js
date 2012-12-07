require(['libs/OpenLayers'], function() { // load libs/OpenLayers.js

	Ember.Logger.log('OpenLayers is available');

	//var serverUrl = 'http://ec2-72-44-46-12.compute-1.amazonaws.com';
	var serverUrl = 'http://ec2-54-242-28-122.compute-1.amazonaws.com';

    var bounds = new OpenLayers.Bounds( // the initial extent
        -13654029.093522, 4549247.2209577,
        -13602816.284578, 4578943.0064423
    );

    var options = {
        controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.Scale($('#scale').get(0)),
			new OpenLayers.Control.MousePosition({element: $('#location').get(0), displayProjection:'EPSG:4326'})
		],
        maxExtent: new OpenLayers.Bounds(
			-13750011.5142, 4427595.063,
			-13506833.8639, 4700595.1644
		),
        maxResolution: 1066.4066460937502,
        projection: 'EPSG:3857',
		theme: App.get('themePath') + 'map/style.css',
        units: 'm'
    };

	$('#mapdiv .placeholder').remove();
	
	OpenLayers.ImgPath = App.get('themePath') + 'map/img/';
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5; // pink tile avoidance
	OpenLayers.DOTS_PER_INCH = 25.4 / 0.28; // make OL compute scale according to WMS spec

    App.set('map', new OpenLayers.Map('mapdiv', options));
    
    // setup Bing layer
    var bing = new OpenLayers.Layer.Bing({
        name: 'Bing Road', type: 'Road',
        key: 'AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf'
    });

    // setup traffic layer (WMS)
    var traffic = new OpenLayers.Layer.WMS('511 Traffic', serverUrl + '/geoserver/SFBA/wms', {
		LAYERS: 'links_0m_layer_view',
		STYLES: '',
		format: 'image/png',
		transparent: 'true'
	}, {
		singleTile: true,
		ratio: 1,
		isBaseLayer: false,
		yx : { 'EPSG:3857' : true }
	}); // end traffic layer

    // setup incident layer (WFS)
	var incidents = new OpenLayers.Layer.Vector('511 Incidents', {
		strategies: [new OpenLayers.Strategy.Fixed()],
		projection: new OpenLayers.Projection('EPSG:4326'),

//		protocol: new OpenLayers.Protocol.WFS({
//			version: '1.1.0',
//			url: serverUrl + '/geoserver/SFBA/ows',
//			featurePrefix: 'SFBA',
//			featureType: 'incident',
//			featureNS: 'http://maps511saas.com/SFBA',
//			geometryName: 'position'
//		}),

		protocol: new OpenLayers.Protocol.Script({
			url: 'http://localhost/IRADMVC/Incidents.mvc/GetIncidents',
			params: {},
			format: OpenLayers.Format.GeoJSON,
			callbackKey: 'format_options', 
			callbackKey: 'callback', 
			parseFeatures: function(data) {
				App.showFeatures(data.Root.features);
			}
		})

//		protocol: new OpenLayers.Protocol.HTTP({
//			url: 'http://localhost/IRADMVC/Incidents.mvc/GetIncidentsJSON',
//			params: {},
//			format: new OpenLayers.Format.JSON(),
//			parseFeatures: function(xhr) {
//				var data = JSON.parse(xhr.responseText);
//				App.showFeatures(data.features);
//			},
//			callback: function() {
//				alert('parseFeatures(callback)');
//			}
//		})

	}); // end incident layer

	App.map.addLayers([bing, traffic, incidents]);

    App.map.zoomToExtent(bounds);

	setTimeout(function() {
		// so we don't see this control jump from mapdiv top/left to top/right
		App.map.addControl(new OpenLayers.Control.LayerSwitcher({
			'div': OpenLayers.Util.getElement('layerswitcher')
		}));
	}, 500);

    // support GetFeatureInfo
    App.map.events.register('click', App.map, function (evt) {
		
		Ember.Logger.log('map clicked at %@1 : [%@2]'.fmt(evt.xy, JSON.stringify(App.map.getLonLatFromPixel(evt.xy))));

        var params = {
            REQUEST: 'GetFeatureInfo',
            EXCEPTIONS: 'application/vnd.ogc.se_xml',
            BBOX: App.map.getExtent().toBBOX(),
            SERVICE: 'WMS',
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: 'links_0m_layer_view',
            FEATURE_COUNT: 4,
            Layers: 'links_0m_layer_view',
            WIDTH: App.map.size.w,
            HEIGHT: App.map.size.h,
            format: 'image/png',
            styles: App.map.layers[0].params.STYLES,
            srs: App.map.layers[0].params.SRS
		};
        
        // handle the wms 1.3 vs wms 1.1 madness
        if (App.map.layers[0].params.VERSION == '1.3.0') {
            params.version = '1.3.0';
            params.j = parseInt(evt.xy.x, 10);
            params.i = parseInt(evt.xy.y, 10);
        } else {
            params.version = '1.1.1';
            params.x = parseInt(evt.xy.x, 10);
            params.y = parseInt(evt.xy.y, 10);
        }
            
        // merge filters
        if (App.map.layers[0].params.CQL_FILTER != null) {
            params.cql_filter = App.map.layers[0].params.CQL_FILTER;
        } 
        if (App.map.layers[0].params.FILTER != null) {
            params.filter = App.map.layers[0].params.FILTER;
        }
        if (App.map.layers[0].params.FEATUREID) {
            params.featureid = App.map.layers[0].params.FEATUREID;
        }

        OpenLayers.Request.GET({
			url: serverUrl + '/geoserver/wms', 
            params: params, 
            scope: this, 
            success: function(xhr) {
				Ember.Logger.log('success, responseText:%@'.fmt(xhr.responseText));
            }, 
            failure: function(xhr) {
				Ember.Logger.log('failure, responseText:%@'.fmt(xhr.responseText));
        }});

        OpenLayers.Event.stop(evt);

    }); // end map click handler

}); // end map code
