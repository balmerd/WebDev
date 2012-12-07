
TestRunner.Steps.push({
	'INITIAL PAGE LOAD with CLEAR CACHE and DATA NOT AVAILABLE': { isComment: true }
});

// step 1
TestRunner.Steps.push({
	'Verify page state': {
		'LatestNews Panel': [
			'Is visible and expanded',
			'News items are not expanded'
		],
		'Recent Trips Panel': [
			'Is hidden'
		],
		'CDT Panel': [
			'Is visible and expanded',
			'"Now" radio button is disabled',
			'"Specific Day and Time" radio button is selected',
			'Current Day and Time are selected by default, and slider is set to the current Time',
			'"Select Start" is visible and enabled',
			'"Select End" is visible, but disabled'
		],
		'Map': [
			'Is not expanded',
			'Caption says "Predicted Traffic..." with current Day and Time',
			'"clear" link is visible',
			'"Reset Map" link is hidden',
			'"Real-time data not available at this time." notification is visible below the "Expand Map" link',
			'Predicted traffic speed lines are visible (SEE: Bookmarklet)'
		],
		'"Calculate Drive Times" map tab': [
			'Is visible and collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is hidden'
		],
		'"PREDICTED Traffic" map tab': [
			'Is visible, but not expanded'
		],
		'Map Toolbar': [
			'Settings match Predicted Predicted settings (SEE: ViewState)'
		],
		'Footer': [
			'Is collapsed'
		]
	}
});

// step 2
TestRunner.Steps.push({
	'Click on "Predicted Traffic" map tab': {
		'CDT Panel': [
			'Is collapsed'
		],
		'"Predicted Traffic map tab': [
			'Is visible and expanded',
			'"Live Traffic" radio button is disabled',
			'"Specific Day & Time" radio button is selected',
			'Current Day is selected, and slider is set to 12:00 PM',
		],
		'Map': [
			'Caption says "Predicted Traffic" and same day/time value as "Predicted Traffic" map tab (red color)',
			'"clear" remains is visible',
			'"Reset Map" link remains hidden',
			'"Real-time data not available at this time." notification remains visible',
			'Predicted traffic speed lines remain visible (SEE: Bookmarklet)'
		]
	}
});

// step 3
TestRunner.Steps.push({
	'Click on "x" close box on "Predicted Traffic" map tab': {
		'CDT Panel': [
			'Remains collapsed'
		],
		'"Predicted Traffic map tab': [
			'Is visible and collapsed'
		],
		'Map': [
			'Caption still says "Predicted Traffic" and same day/time value as "Predicted Traffic" map tab (red color)',
			'"clear" remains is visible',
			'"Reset Map" link remains hidden',
			'"Real-time data not available at this time." notification remains visible',
			'Predicted traffic speed lines remain visible (SEE: Bookmarklet)'
		]
	}
});

// step 4
TestRunner.Steps.push({
	'Repeat step #2 above, then click on "Predicted Traffic" map tab text': {
		'CDT Panel': [
			'Remains collapsed'
		],
		'"Predicted Traffic map tab': [
			'Is visible and collapsed'
		],
		'Map': [
			'Caption still says "Predicted Traffic" and same day/time value as "Predicted Traffic" map tab (red color)',
			'"clear" remains is visible',
			'"Reset Map" link remains hidden',
			'"Real-time data not available at this time." notification remains visible',
			'Predicted traffic speed lines remain visible (SEE: Bookmarklet)'
		]
	}
});

// step 5
TestRunner.Steps.push({
	'Repeat step #2 above, then click on "clear" link on map header': {
		'CDT Panel': [
			'Remains is expanded'
		],
		'"Predicted Traffic map tab': [
			'Is visible and collapsed'
		],
		'CDT Panel': [
			'Is visible and expanded',
			'"Now" radio button is disabled',
			'"Specific Day and Time" radio button is selected',
			'Current Day and Time are selected by default, and slider is set to the current Time',
			'"Select Start" is visible and enabled',
			'"Select End" is visible, but disabled'
		],
		'Map': [
			'Caption says "Predicted Traffic" and current day/time value (red color)',
			'"clear" remains is visible',
			'"Reset Map" link remains hidden',
			'"Real-time data not available at this time." notification remains visible',
			'Predicted traffic speed lines remain visible (SEE: Bookmarklet)'
		]
	}
});

TestRunner.Steps.push({
	'CREATE A NEW TRIP USING THE CDT PANEL (PREDICTED TRAFFIC)': { isComment: true, notes: 'the main road and cross road dropdowns are automatically populated after selecting the Start City and End HotSpot' }
});

TestRunner.Steps.push({
	'SELECT POINT A CITY (with CDT Panel expanded from #5 above)': { isComment: true }
});

// step 6
TestRunner.Steps.push({
	'Click on "Select Start" in Step 2 of 3 of expanded CDT Panel': {
		'CDT Panel': [
			'"Select Start" under Step 2 of 3 replaced with the "Cities and HotSpots" widget, with the city list displayed'
		],
		'"LIVE Traffic map tab': [
			'Is hidden'
		],
		'"Traffic Off tab': [
			'Is visible, but disabled'
		],
		'Map': [
			'Caption changes from "Current Traffic Conditions..." to "Calculate Drive Times"',
			'"cancel" link is visible',
			'Start nodes are visible'
		],
		'Map Toolbar': [
			'Settings match CDT settings (SEE: ViewState)'
		]
	}
});

// step 7
TestRunner.Steps.push({
	'Click on "Alameda" in Step 2 of 3 "Cities"': {
		'CDT Panel': [
			'"Cities and HotSpots" widget is hidden',
			'Step 2 of 3 city is "Alameda"',
			'Step 2 of 3 main road is "29th Ave"',
			'Step 2 of 3 cross road is "I-880"',
			'Step 3 of 3 dropdowns are visible, but only "Select End" is enabled'
		],
		'Map': [
			'Point A is visible',
			'End nodes are visible'
		],
		'Url': [
			'Is changed to reflect current trip selections'
		]
	}
});

TestRunner.Steps.push({
	'SELECT POINT B HOTSPOT': { isComment: true }
});

// step 8
TestRunner.Steps.push({
	'Click on "Select End" in Step 3 of 3 of expanded CDT Panel': {
		'CDT Panel': [
			'"Select End" under Step 3 of 3 replaced with the "Cities and HotSpots" widget, with the city list displayed'
		]
	}
});

// step 9
TestRunner.Steps.push({
	'Click on Step 3 of 3 "HotSpots"': {
		'CDT Panel': [
			'Step 3 of 3 list of hotspots displayed'
		]
	}
});

// step 10
TestRunner.Steps.push({
	'Click on "Altamont Pass" in Step 3 of 3 "HotSpots"': {
		'Map': [
			'Point B is visible'
		],
		'Url': [
			'Is changed to reflect current trip selections'
		]
	}
});

TestRunner.Steps.push({
	'GET TRIP RESULTS': { isComment: true }
});

// step 11
TestRunner.Steps.push({
	'Verify page state': {
		'CDT Panel': [
			'"Your Trip" menu is visible with "Revise", "New", and "Clear" options',
			'Step 1 of 3 text is hidden, but "Now" and "Specific Day and Time" radio buttons are visible',
			'Step 1 of 3 "Now" radio button is disabled',
			'Step 1 of 3 "Specific Day and Time" radio button is set to Day and Time selected',
			'Step 2 of 3 and dropdowns are hidden',
			'Step 2 of 3 and dropdowns are hidden',
			'Trip summary and details are displayed (TODO: screenshot)'
		],
		'Map': [
			'Caption says "Trip Results: Alameda to Livermore" along with predicted day and time (red color)',
			'"clear" link is visible',
			'"Reset Map" link is visible',
			'Trip path is drawn between A and B points',
			'Predicted traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'is visible and checked'
		],
		'"LIVE Traffic" map tab': [
			'Is hidden'
		],
		'"Predicted Traffic" map tab': [
			'Is visible, but collapsed'
		],
		'"Traffic Off" map tab': [
			'Is hidden'
		],
		'Map Toolbar': [
			'Settings match Predicted Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'TODO: VERIFY MAP TOOLBAR FUNCTIONALITY': { isComment: true }
});
