
Ember.Logger.log('app.js loaded');

require(['js/extensions.js'], function(util) {
    // This function is called when required js files are loaded.
    // If util.js calls define(), then this function is not fired until
    // util's dependencies have loaded, and the util argument will hold
    // the module value for "helper/util".
	Ember.Logger.log('extensions.js loaded');
});

window.App = Ember.Application.create({
	//
	// properties
	//
	name: 'SAIC IRaD Prototype',
	version: '1.0.0',
	rootElement: 'body', // this is the default
	//
	// method called when $(document).ready
	//
	ready: function() {

		App.resizeHandler(function() {

			App.bindEventHandlers();

			App.set('breakingNewsController', Ember.ArrayController.create({
				content: [
					App.BreakingNewsItem.create({
						date: '09/07/12 01:15 pm',
						title: 'Caltrans Construction Activity on the Bay Bridge / I-80',
						details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales aliquam commodo. Praesent ac mauris non erat mattis vestibulum.'
					}),
					App.BreakingNewsItem.create({
						date: '09/07/12 11:13 am',
						title: 'Overnight Lane Closures Scheduled for the San Mateo Bridge/CA-92',
						details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales aliquam commodo. Praesent ac mauris non erat mattis vestibulum.'
					}),
					App.BreakingNewsItem.create({
						date: '09/07/12 11:12 am',
						title: 'US-101 Auxiliary Lane Project in Palo Alto / Mountain View Area',
						details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales aliquam commodo. Praesent ac mauris non erat mattis vestibulum.'
					})
				]
			}));

			App.BreakingNewsModule.create().appendTo('#breaking-news');

			$('#lorem-ipsum').removeClass('hidden'); // HACK: so we don't see it until breaking news module is rendered

			require(['map'], function() { // load map.js
				Ember.Logger.log('map loaded');
			});

		}); // end resize handler callback
	},
	//
	// method
	//
	bindEventHandlers: function() {

		$(window).resize($.debounce(250, this.resizeHandler));

		$('button').button().click(function() {
			$(this).blur(); // so that focus doesn't remain on button
			switch($(this).attr('name')) {
				case 'btnLinks':
					var layer = App.map.getLayersByName('511 Traffic');
					var visible = layer[0].getVisibility();
					layer[0].setVisibility(!visible);
					break;
				case 'btnEvents':
					Ember.Logger.log('you clicked on the Events button');
					break;
			}
		}).removeClass('hidden'); // so we don't see plain html buttons before they are converted to jQuery UI buttons

		$('section[role=main] div.side .module').on('click', 'header', function() {
			$(this).parent().find('.collapsible').toggleClass('hidden');
		});
	},
	//
	// method
	//
	resizeHandler: function(callback) {
		var map$ = $('#mapdiv');
		var map = map$.offset();
		var foot = $('footer[role=contentinfo]').offset();
		var newHeight = Math.round(foot.top - map.top - 10);
		map$.height(newHeight).removeClass('invisible');
		$('div.side > .container').height(newHeight); // so that side will show vscrollbar if it gets taller than the map
		map$ = null;

		if (typeof callback === 'function') {
			callback();
		}
	},
	//
	// method
	//
	showFeatures: function(features) {
			
		var lonlat, marker;
		var size = new OpenLayers.Size(21, 25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon(OpenLayers.ImgPath + 'marker.png', size, offset);

		var markers = new OpenLayers.Layer.Markers('Markers');

		Ember.Logger.log('showFeatures() : ' + JSON.stringify(features));

		$.each(features, function(index, feature) {
			lonlat = new OpenLayers.LonLat(feature.geometry.coordinates);
			Ember.Logger.log('adding marker at ' + JSON.stringify(lonlat));

			marker = new OpenLayers.Marker(lonlat, icon.clone());
//			// HACK: attach data to the marker
//			marker.data = feature;

//			marker.events.register('mousedown', marker, function(evt) {
//				var data = this.data;
//				Ember.Logger.log(JSON.stringify(data));

//				var popup = new OpenLayers.Popup.Anchored(
//					"incidentpopup", // id
//					new OpenLayers.LonLat(data.geometry.coordinates), // lonlat
//					null, // contentSize
//					"<div>Some details about this feature...</div>", // contentHTML
//					this.icon,
//					true, // closeBox
//					function() { // closeBoxCallback
//						App.map.removePopup(feature.popup);
//						data.popup.destroy();
//						data.popup = null;
//					}
//				);

//				popup.autoSize = true;
//				popup.minSize = new OpenLayers.Size(200, 50);
//				popup.maxSize = new OpenLayers.Size(400, 300);
//				data.popup = popup;
//				App.map.addPopup(popup, true);

//				OpenLayers.Event.stop(evt); // does NOT prevent map click handler from firing
//			});

			markers.addMarker(marker);

		});

		App.map.addLayer(markers);
	},
	//
	// method
	//
	themePath: function() {
		var i, href, matches, path = 'theme/default/';
		for (i=0; i<document.styleSheets.length; i++) {
			if (document.styleSheets[i].title === 'main') {
				href = document.styleSheets[i].href;
				matches = href.match(/(theme\/.*\/)/i);
				path = matches[0];
				break;
			}
		}
		return path;
	}.property()
});

App.set('BreakingNewsItem', Ember.Object.extend({
	//
	// properties
	//
	date: null,
	title: null,
	details: null
}));

App.set('BreakingNewsModule', Ember.View.extend({
	//
	// properties
	//
	//elementId: '#breaking-news',
	templateName: 'breakingNewsModule',
	//
	// conmputed properties
	//
	lastUpdated: function() {
		//return (new Date().toLocaleString());
		return (new Date().format('mm/dd/yy h:MM tt'));
	}.property(),
	//
	// events
	//
	didInsertElement : function() { // called when template has been rendered
		$('#breaking-news').removeClass('hidden'); // so we don't see empty module before it's rendered
		//this.get('elementId').removeClass('hidden'); // so we don't see empty module before it's rendered
		$('tr.news-item').unbind('hover').hover(function() {
			$(this).addClass('hover');
		}, function() {
			$(this).removeClass('hover');
		}).unbind('click').click(function() {
			$(this).find('.news-details').toggleClass('hidden');
		});
	}
}));
