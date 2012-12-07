//Ember.LOG_BINDINGS = true;

// SAIC.Traffic.Page.State.Trips[x]:
//		{'StartNode':{'ID':'1265','City':'Alameda','MainRoad':'29th Ave','CrossRoad':'I-880','Latitude':'37.775076','Longitude':'-122.233375'},
//		'EndNode':{'ID':'1084','City':'Livermore','MainRoad':'I-580','CrossRoad':'N Flynn Rd','Latitude':'37.719234','Longitude':'-121.660416'},
//		'SelectedPath':4,'DefaultPath':4,'Status':0,'RoadNames':'I-880 S / I-238 S / I-580 E','TravelTime':3361,'HisTravelTime':2892,
//		'HistoricSettings':{'Day':'Monday','Time':'4:45 PM'}}

Handlebars.registerHelper('minutes', function(property, options) { // creates unbound value :-(
	var value = this.getPath(property); // when helper is called within a bound view, property name is relative to the bound object eg: 'currentTime'
	if (value) {
		return '%@1 min.'.fmt(Math.round(value / 60));
	} else {
		value = Ember.getPath(property); // when helper is called outside of a bound view, property name is fully qualified ie: 'App.trip.travelTime'
		if (value) {
			return '%@1 min.'.fmt(Math.round(value / 60));
		} else {
			return 'N/A';
		}
	}
});

window.App = Ember.Application.create({
	name: '511TrafficMVC',
	version: '1.0.0',
	rootElement: 'body', // this is the default
	copyright: 'Copyright &copy; %@1 SAIC Inc.'.fmt((new Date()).getFullYear()),
	ready: function() {

		App.set('trip', App.Trip.create({ // create instance
			defaultPath: 2,
			selectedPath: 2,
			status: '0', // TBD: bound to ???
			roadNamesBinding: Ember.Binding.oneWay('App.drivingTimes.roadNamesForSelectedPath'),
			currentTimeBinding: Ember.Binding.oneWay('App.drivingTimes.summaryForSelectedPath.currentTime'),
			typicalTimeBinding: Ember.Binding.oneWay('App.drivingTimes.summaryForSelectedPath.typicalTime'),
			historicSettings: App.HistoricSettings.create({ day: 'Monday', time: '4:45 PM' }),
			startNode: App.Node.create({ id: 1265, city: 'Alameda', mainRoad: '29th Ave', crossRoad: 'I-880', latitude: '37.775076', longitude: '-122.233375' }),
			endNode: App.Node.create({ id: 1084, city: 'Livermore', mainRoad: 'I-580', crossRoad: 'N Flynn Rd', latitude: '37.719234', longitude: '-121.660416' })
		}));

		// TODO: populate drivingTimes from AJAX call using App.trip data

//		var url = 'http://localhost/511Traffic2.0/DrivingTime.mvc/GetTravelTimeByNodeID?startingNode=%@1&EndingNode=%@2&selectedPath=%@3&_=%@4';
//		$.getJSON(url.fmt(App.trip.startNode.get('id'), App.trip.endNode.get('id'), App.trip.get('selectedPath')), function(data) {
//			var defaultPath = App.trip.get('defaultPath');
//			App.set('drivingTimes', App.DrivingTimes.create({
//				summary: [],
//				details: []
//			}));
//			$.each(data.Summary, function(index, item) {
//				App.drivingTimes.summary.push(App.DrivingTimeSummary.create({
//					isActive: (item.PathNumber === defaultPath),
//					routeNumber: index + 1,
//					pathNumber: item.PathNumber,
//					currentTime: item.TravelTime,
//					typicalTime: item.HisTravelTime,
//					miles: item.PathLengthMiles,
//					incidents: item.IncidentCount
//				}));
//			});
//			$.each(data.Details, function(index, item) {
//				App.drivingTimes.details.push(App.DrivingTimeDetail.create({
//					pathNumber: item.PathNumber,
//					roadName: item.RoadName,
//					currentSpeed: item.MeanSpeed,
//					typicalSpeed: item.HisMeanSpeed,
//					incidents: item.IncidentCount
//				}));
//			});
//		});

		App.set('drivingTimes', App.DrivingTimes.create({
			summary: [
				App.DrivingTimeSummary.create({ pathNumber: 3, currentTime: 2040, typicalTime: 2220, miles: 35, incidents: 1 }),
				App.DrivingTimeSummary.create({ pathNumber: 7, currentTime: 2580, typicalTime: 2760, miles: 44.3, incidents: 0 }),
				App.DrivingTimeSummary.create({ pathNumber: 2, currentTime: 2880, typicalTime: 2940, miles: 47, incidents: 0 }),
				App.DrivingTimeSummary.create({ pathNumber: 9, currentTime: 3060, typicalTime: 2940, miles: 49.5, incidents: 0 })
			],
			details: [
				App.DrivingTimeDetail.create({ pathNumber: 3, roadName: 'I-880 S', currentSpeed: 61, typicalSpeed: 61, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 3, roadName: 'I-238 S', currentSpeed: 60, typicalSpeed: 55, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 3, roadName: 'I-580 E', currentSpeed: 62, typicalSpeed: 58, incidents: 0 }),

				App.DrivingTimeDetail.create({ pathNumber: 7, roadName: 'I-880 N', currentSpeed: 42, typicalSpeed: 50, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 7, roadName: 'I-980 E', currentSpeed: 60, typicalSpeed: 61, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 7, roadName: 'I-980 E-I-580 E-W Ramp', currentSpeed: 57, typicalSpeed: 35, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 7, roadName: 'I-980 E-I-580 E Ramp', currentSpeed: 68, typicalSpeed: 55, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 7, roadName: 'I-580 E', currentSpeed: 63, typicalSpeed: 62, incidents: 0 }),

				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'I-880 N', currentSpeed: 42, typicalSpeed: 50, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'I-980 E', currentSpeed: 60, typicalSpeed: 61, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'CA-24 E', currentSpeed: 52, typicalSpeed: 60, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'CA-24 E-CA-13 S Ramp', currentSpeed: 57, typicalSpeed: 54, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'CA-13 S', currentSpeed: 58, typicalSpeed: 58, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'CA-13 S-I-580 E Ramp', currentSpeed: 62, typicalSpeed: 66, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 2, roadName: 'I-580 E', currentSpeed: 63, typicalSpeed: 61, incidents: 0 }),

				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'I-880 N', currentSpeed: 45, typicalSpeed: 50, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'I-980 E', currentSpeed: 60, typicalSpeed: 61, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'CA-24 E', currentSpeed: 60, typicalSpeed: 60, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'CA-24 E-I-680 S Ramp', currentSpeed: 61, typicalSpeed: 55, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'I-680 S', currentSpeed: 62, typicalSpeed: 65, incidents: 0 }),
				App.DrivingTimeDetail.create({ pathNumber: 9, roadName: 'I-580 E', currentSpeed: 62, typicalSpeed: 60, incidents: 0 })
			]
		}));
	}
});

App.set('Trip', Ember.Object.extend({ // create class
	//
	// properties
	//
	historicSettings: null,
	startNode: null,
	endNode: null,
	defaultPath: null,
	selectedPath: null,
	status: null,
	//
	// computed property
	//
	currentMinutes: function() {
		var textColor = '';
		var current = this.get('currentTime');
		var typical = this.get('typicalTime');
		if (current) {
			if (typical) {
				if (current > typical) {
					textColor = 'red-text';
				} else if (current < typical) {
					textColor = 'green-text';
				}
			}
			return new Handlebars.SafeString('<span class="%@1">%@2 min.</span>'.fmt(textColor, Math.round(current / 60)));
		} else {
			return 'N/A';
		}
	}.property('currentTime', 'typicalTime'),
	//
	// computed property
	//
	typicalMinutes: function() { // USING minutes HELPER
		var typical = this.get('typicalTime');
		if (typical) {
			return '%@1 min.'.fmt(Math.round(typical / 60));
		} else {
			return 'N/A';
		}
	}.property('typicalTime')
}));

App.set('HistoricSettings', Ember.Object.extend({ // create class
	//
	// properties
	//
	day: null,
	time: null
}));
	
App.set('Node', Ember.Object.extend({ // create class
	//
	// properties
	//
	id: null,
	city: null,
	mainRoad: null,
	crossRoad: null
	//
	// computed property
	//
	,description: function() {
		return '%@1 %@2 &amp; %@3'.fmt(this.get('city'), this.get('mainRoad'), this.get('crossRoad'));
	}.property('city', 'mainRoad', 'crossRoad')
}));

App.set('DrivingTimes', Ember.Object.extend({
	//
	// properties
	//
	summary: null,
	details: null,
	note: null,
	defaultPathBinding: Ember.Binding.oneWay('App.trip.defaultPath'),
	selectedPathBinding: Ember.Binding.oneWay('App.trip.selectedPath'),
	//
	// computed property
	//
	detailsForSelectedPath: function() {
		return this.details.filterProperty('pathNumber', this.get('selectedPath')); // filterProperty() returns an array
		// adding the 'selectedPath' dependency automatically updates the details view when the selectedPath property changes
	}.property('selectedPath'),
	//
	// computed property
	//
	roadNamesForSelectedPath: function() {
		return this.get('detailsForSelectedPath').getEach('roadName').join(' / ');
	}.property('selectedPath'),
	//
	// computed property
	//
	summaryForSelectedPath: function() {
		return this.summary.findProperty('pathNumber', this.get('selectedPath')); // findProperty() returns a single object
	}.property('selectedPath'),
	//
	// initialization
	//
	init: function() { // called automatically by create()
		// mark summary row having the defaultPath as active, and set route number from index
		var defaultPath = this.get('defaultPath');
		this.summary.forEach(function(item, index) {
			item.set('isActive', (item.get('pathNumber') === defaultPath)).set('routeNumber', (index + 1));
		});
	},
	//
	// methods
	//
	revertToDefaultPath: function() {
		this.set('selectedPath', this.get('defaultPath')); // will fire observer for selectedPath property
	},
	//
	// observer
	//
	selectedPathChanged: function() {
		var selectedPath = this.get('selectedPath');
		this.summary.forEach(function(item) {
			item.set('isActive', (item.get('pathNumber') === selectedPath)); // changing isActive flag will update class name on <tr> via classBinding
		});
		Ember.Logger.log('DrivingTimes.selectedPathChanged() to %@1'.fmt(selectedPath));
		// no need to update the App.trip values, they are for the defaultPath
	}.observes('selectedPath')
}));

App.set('DrivingTimeSummary', Ember.Object.extend({
	//
	// properties
	//
	isActive: false,
	routeNumber: null,
	pathNumber: null,
	currentTime: null,
	typicalTime: null,
	miles: null,
	incidents: null,
	//
	// computed property
	//
	currentMinutes: function() {
		var current = this.get('currentTime');
		if (current) {
			return '%@1 min.'.fmt(Math.round(current / 60));
		} else {
			return 'N/A';
		}
	}.property('currentTime'),
	//
	// computed property
	//
	typicalMinutes: function() {
		var typical = this.get('typicalTime');
		if (typical) {
			return '%@1 min.'.fmt(Math.round(typical / 60));
		} else {
			return 'N/A';
		}
	}.property('typicalTime'),
	//
	// observer (would be better implemented as a BINDING)
	//
	currentTimeChanged: function() {
		var currentTime = this.get('currentTime');
		var pathNumber = this.get('pathNumber');
		var defaultPath = App.get('trip').get('defaultPath');

		Ember.Logger.log('DrivingTimes.summary.currentTimeChanged() to %@1'.fmt(currentTime));

		if (pathNumber === defaultPath) {
			App.get('trip').set('currentTime', currentTime);
		}
	}.observes('currentTime')
}));

App.set('DrivingTimeDetail', Ember.Object.extend({
	//
	// properties
	//
	pathNumber: null,
	roadName: null,
	currentSpeed: null,
	typicalSpeed: null,
	incidents: null
}));

App.set('TripHeaderView', Ember.View.extend({
	//
	// properties
	//
	templateName: 'tripHeader',
	//
	// methods
	//
	setSelectedPath: function(pathNumber) {
		Ember.Logger.log('TripHeaderView.setSelectedPath() changed to %@1'.fmt(pathNumber));
	}
}));

App.set('TripResultsView', Ember.View.extend({
	//
	// properties
	//
	templateName: 'tripResults',
	//
	// methods
	//
	setSelectedPath: function(pathNumber) { // CURRENTLY NOT USED
		Ember.Logger.log('TripResultsView.setSelectedPath() changed to %@1'.fmt(pathNumber));
	}
}));

App.set('DrivingTimeSummaryView', Ember.View.extend({
	click: function(evt) { // no declaration required because this is the default event called automatically by click event on this view
		App.get('drivingTimes').set('selectedPath', this._context.get('pathNumber')); // context is a reference to the data object bound to this row
		//this.get('parentView').setSelectedPath(this._context.get('pathNumber')); // call method on parent view (TripResultsView)
	}
}));
