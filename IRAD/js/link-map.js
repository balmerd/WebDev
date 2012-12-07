var serverUrl = "http://ec2-72-44-46-12.compute-1.amazonaws.com";

var map;
var selectControl;
var selectedFeature;

// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

function onPopupClose(evt) {
    selectControl.unselect(selectedFeature);
}

function onFeatureSelect(feature) {
    selectedFeature = feature;
    var popup = new OpenLayers.Popup.FramedCloud("incidentpopup", 
         feature.geometry.getBounds().getCenterLonLat(),
         null,
         "<div><div class='heading'>" +
         "<img src='"+feature.attributes.icon+"'></img>"+
         "<span class='popup-title'>" + feature.attributes.summary +"</span></div>" +
         "<div class='body'>"+feature.attributes.details+"</div>"+
         "</div>",
         null, true, onPopupClose);
    popup.autoSize = true;
    popup.minSize = new OpenLayers.Size(200, 50);
    popup.maxSize = new OpenLayers.Size(400, 300);
    feature.popup = popup;
    map.addPopup(popup, true);
}

function onFeatureUnselect(feature) {
    map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
}    

function init(){
    var bounds = new OpenLayers.Bounds(
        -13750011.5142, 4427595.063,
        -13506833.8639, 4700595.1644
    );
    
    var options = {
        controls: [],
        maxExtent: bounds,
        maxResolution: 1066.4066460937502,
        projection: "EPSG:3857",
        units: 'm'
    };
    map = new OpenLayers.Map('map', options);
    
    var osm = new OpenLayers.Layer.OSM("OpenStreetMap");
    var local = new OpenLayers.Layer.OSM("Locally generated OpenSteetMap, MapQuest styling", 
            "http://mobilemapdev.isd.saic.com/sfbaytiles/${z}/${x}/${y}.png");
        
    // Bing layers, various flavors
    var bingApiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var bing = new OpenLayers.Layer.Bing({
        name: "Bing Road",
        key: bingApiKey,
        type: "Road"
    });

    var google = new OpenLayers.Layer.Google("Google Streets", {
        numZoomLevels : 20,
        sphericalMercator : true
    });            
    
    // setup traffic layer (WMS)
    var traffic = new OpenLayers.Layer.WMS("511 Traffic", 
            serverUrl + "/geoserver/SFBA/wms", {
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

    // setup incident layer (WFS)
    var incidents = new OpenLayers.Layer.Vector("511 Incidents", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        projection: new OpenLayers.Projection("EPSG:4326"),
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: serverUrl + "/geoserver/SFBA/ows",
            featurePrefix:"SFBA",
            featureType: "incident",
            featureNS: "http://maps511saas.com/SFBA",
            geometryName: "position"
        }),
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                 pointRadius: 9,
                 fillColor: "#ffcc66",
                 strokeColor: "#ff9933",
                 strokeWidth: 2,
                 graphicZIndex: 1,
                 externalGraphic: '${icon}'
            }),
            "select": new OpenLayers.Style({
                 pointRadius: 9,
                 fillColor: "#ffcc66",
                 strokeColor: "#ff9933",
                 strokeWidth: 2,
                 graphicZIndex: 1,
                 externalGraphic: '${icon}'
           }),
       })
    });

    map.addLayers([osm, google, bing, local, traffic, incidents]);

    selectControl =    new OpenLayers.Control.SelectFeature(incidents,
        {onSelect: onFeatureSelect,
         onUnselect: onFeatureUnselect});

    // build up all controls
    map.addControl(new OpenLayers.Control.PanZoomBar({
         position: new OpenLayers.Pixel(2, 15)
       }));
    map.addControl(new OpenLayers.Control.Navigation());
    map.addControl(new OpenLayers.Control.Scale($('#scale').get(0)));
    map.addControl(new OpenLayers.Control.MousePosition({element: $('#location').get(0), displayProjection:'EPSG:4326'}));
    map.addControl(new OpenLayers.Control.LayerSwitcher({
        'div': OpenLayers.Util.getElement('layerswitcher')
    }));
    map.addControl(selectControl);

    selectControl.activate();

    map.zoomToExtent(bounds);

    // support GetFeatureInfo
    map.events.register('click', map, function (e) {
        document.getElementById('nodelist').innerHTML = "Loading... please wait...";
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: map.getExtent().toBBOX(),
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: 'links_0m_layer_view',
            FEATURE_COUNT: 4,
            Layers: 'links_0m_layer_view',
            WIDTH: map.size.w,
            HEIGHT: map.size.h,
            format: 'image/png',
            styles: map.layers[0].params.STYLES,
            srs: map.layers[0].params.SRS};
        
        // handle the wms 1.3 vs wms 1.1 madness
        if(map.layers[0].params.VERSION == "1.3.0") {
            params.version = "1.3.0";
            params.j = parseInt(e.xy.x);
            params.i = parseInt(e.xy.y);
        } else {
            params.version = "1.1.1";
            params.x = parseInt(e.xy.x);
            params.y = parseInt(e.xy.y);
        }
            
        // merge filters
        if(map.layers[0].params.CQL_FILTER != null) {
            params.cql_filter = map.layers[0].params.CQL_FILTER;
        } 
        if(map.layers[0].params.FILTER != null) {
            params.filter = map.layers[0].params.FILTER;
        }
        if(map.layers[0].params.FEATUREID) {
            params.featureid = map.layers[0].params.FEATUREID;
        }
        OpenLayers.Request.GET({url: serverUrl + "/geoserver/wms", 
            params: params, 
            scope: this, 
            success: function(response) {
                setHTML(response, e.xy);
            }, 
            failure: function (response) {
                setHTML(response, e.xy);
        }});
        OpenLayers.Event.stop(e);
    });
}

// sets the HTML provided into the nodelist element
function setHTML(response, xy){
    document.getElementById('nodelist').innerHTML = response.responseText;

    var tableData = parseTable(response.responseText);
    var featureHtml = generateFeatureQueryHtml(tableData);

    if (response.responseText.indexOf("<table class=\"featureInfo\">") != -1){
        popup = new OpenLayers.Popup.FramedCloud(
            "featurepopup", 
            map.getLonLatFromPixel(xy),
            null,
            featureHtml,
            null, true);
        popup.autoSize = true;
        popup.minSize = new OpenLayers.Size(200, 50);
        popup.maxSize = new OpenLayers.Size(400, 300);
        map.addPopup(popup, true);
    }
}
function generateFeatureQueryHtml(featureData) {
     // need some sort of template here!!
     var featureHtml = '<div class="featureQuery">';
     featureHtml += "Nearby roads<table>";
     for (var i = 0; i < featureData.length; i++) {
         featureHtml += "<tr>";
         featureHtml += "<td>" + featureData[i].name + "</td>";
         featureHtml += "<td>" + featureData[i].speedcolor + "</td>";
         featureHtml += "</tr>";
     }
     featureHtml += "</table></div>";
     return featureHtml;
}

function parseTable(htmlText) {
    var index = 0;
    var rowValues;
    var columnNames = []; // array of string
    var tableData = [];  // array of object representing a single row
    var tablePage = $(htmlText);
    $('th', tablePage).each(function() {
           columnNames.push($(this).html());
    });
    $('tr', tablePage).each(function() {
        if ($(this).find('td').size() > 0) {
            index = 0;
            rowValues = {};
            tableData.push(rowValues);
            $(this).find('td').each(function() {
                rowValues[columnNames[index]] = $(this).html();
                index++;
            });
        }
    });
    return tableData;
}
