
var SAIC = {
	IRAD: {
		Config: {
			Logging: {
				enabled: true
			},
			Ajax: {
				timeout: 30000,
				logResponse: false
			},
			Refresh: {
				enabled: false,
				interval: 180000,
				autoRefreshLimit: 3
			},
			MapServices: {
				enabled: true,
				trafficEnabled: true,
				incidentsEnabled: true,
				proxyRequired: true, //(/LOCALHOST/i).test(window.location.hostname),
				settings: {
					serverUrl: 'http://maps.511saas.com', // TODO: get this from server config
					initialExtent: [-13654029.093522, 4549247.2209577, -13602816.284578, 4578943.0064423],
					options: {
						// maxExtent doesn’t keep people from moving the map
						restrictedExtent: [-13750011.5142, 4427595.063, -13506833.8639, 4700595.1644],
						maxResolution: 1066.4066460937502,
						projection: 'EPSG:3857',
						displayProjection: 'EPSG:4326',
						units: 'm'
					}
				}
			}
		}
	}
};

$(function() {
	var map = null;
	var incidentSelector = null;
	var layers = {};
//	var options = SAIC.IRAD.Config.MapServices.settings;
//	var serverUrl = options.serverUrl;
//	var initialExtent = options.initialExtent;
	var serverUrl = 'http://maps.511saas.com';
	var initialExtent = [-13654029.093522, 4549247.2209577, -13602816.284578, 4578943.0064423];
	var options = {
		// maxExtent doesn’t keep people from moving the map
		restrictedExtent: [-13750011.5142, 4427595.063, -13506833.8639, 4700595.1644],
		maxResolution: 1066.4066460937502,
		projection: 'EPSG:3857',
		displayProjection: 'EPSG:4326',
		units: 'm'
	};

	if (SAIC.IRAD.Config.MapServices.proxyRequired) {
		OpenLayers.ProxyHost = 'http://localhost/IRADMVC/map.proxy?url='; // only required for localhost testing
	}

	OpenLayers.ImgPath = 'Content/themes/base/stylesheets/map/images/';
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5; // pink tile avoidance
	OpenLayers.DOTS_PER_INCH = 25.4 / 0.28; // make OL compute scale according to WMS spec

	var basemap = new OpenLayers.Layer.Bing({
		type: 'Road',
		name: 'Bing Road',
		isBaseLayer: true,
		key: 'AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf'
	});

	var traffic = new OpenLayers.Layer.WMS("511 Traffic", serverUrl + "/geoserver/SFBA/wms", {
		LAYERS: 'links_0m_layer_view',
		STYLES: '',
		format: 'image/png',
		transparent: "true"
	}, {
		singleTile: true,
		ratio: 1,
		isBaseLayer: false,
		yx : {'EPSG:3857' : true}
	});

	var incidents = layer = new OpenLayers.Layer.Vector('511 Incidents', {
		// this strategy requests features once and never requests new data
		// use App.mapController.layers.incidents.refresh()
		strategies: [new OpenLayers.Strategy.Fixed()],

		// projection matches GeoServer "Native SRS" for this layer
		// EPSG:4326 is returned as a <CRS> (along with CRS:84) by GetCapabilities, is DefaultSRS
		projection: new OpenLayers.Projection('EPSG:4326'),

		protocol: new OpenLayers.Protocol.WFS({
			//version: '1.1.0', // does NOT work with OpenLayers.mobile
			version: '1.0.0',
			url: serverUrl + '/geoserver/SFBA/ows',
			featurePrefix: 'SFBA',
			featureType: 'incident',
			featureNS: 'http://maps511saas.com/SFBA',
			geometryName: 'position'
		}),
		styleMap: new OpenLayers.StyleMap({
			'default': new OpenLayers.Style({
				pointRadius: 9, // size of icon
				graphicZIndex: 1,
				externalGraphic: 'Content/themes/base/' + '${icon}' // selects the <SFBA:icon> node from the xml returned
			}),
			'select': new OpenLayers.Style({
				pointRadius: 9,
				graphicZIndex: 1,
				externalGraphic: 'Content/themes/base/' + '${icon}'
			})
		}),
		visibility: false
	});

	map = new OpenLayers.Map('mapdiv', $.extend(options, {
		theme: 'Content/themes/base/stylesheets/map/style.css', 
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.LayerSwitcher( { 'div': OpenLayers.Util.getElement('layerswitcher') })
		],
		layers: [basemap]
	}));

	setTimeout(function() {
		map.addLayers([traffic, incidents]);
	}, 100);

	map.zoomToExtent(initialExtent);
});