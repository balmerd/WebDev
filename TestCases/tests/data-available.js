
TestRunner.Steps.push({
	'INITIAL PAGE LOAD with CLEAR CACHE and DATA AVAILABLE': { isComment: true }
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
			'"Now" radio button is selected',
			'"Select Start" is visible and enabled',
			'"Select End" is visible, but disabled'
		],
		'Map': [
			'Is not expanded',
			'Caption says "Current Traffic Conditions..."',
			'"Reset Map" link is hidden',
			'Live traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Calculate Drive Times" map tab': [
			'Is visible and collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is visible and collapsed'
		],
		'"PREDICTED Traffic" map tab': [
			'Is hidden'
		],
		'Map Toolbar': [
			'Settings match Live Traffic settings  (SEE: ViewState)'
		],
		'Footer': [
			'Is collapsed'
		]
	}
});

// step 2
TestRunner.Steps.push({
	'Click on "LIVE Traffic" map tab': {
		'CDT Panel': [
			'Is collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is visible and expanded'
		]
	}
});

// step 3
TestRunner.Steps.push({
	'Click on "x" close box on "LIVE Traffic" map tab': {
		'"LIVE Traffic map tab': [
			'Is visible and collapsed'
		]
	}
});

// step 4
TestRunner.Steps.push({
	'Repeat step #2 above, then click on "LIVE Traffic" map tab text': {
		'"LIVE Traffic map tab': [
			'Is visible and collapsed'
		]
	}
});

TestRunner.Steps.push({
	'CREATE A NEW TRIP USING THE CDT PANEL (LIVE TRAFFIC)': { isComment: true, notes: 'the main road and cross road dropdowns are automatically populated after selecting the Start City and End HotSpot' }
});

// step 5
TestRunner.Steps.push({
	'Click on CDT Panel (while collapsed from #4 above)': {
		'CDT Panel': [
			'Is visible, and expanded',
			'"Now" radio button is enabled and selected',
			'"Select Start" is visible and enabled',
			'"Select End" is visible, but disabled'
		]
	}
});

TestRunner.Steps.push({
	'SELECT POINT A CITY': { isComment: true }
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
			'Step 2 of 3 and dropdowns are hidden',
			'Step 2 of 3 and dropdowns are hidden',
			'Trip summary and details are displayed (TODO: screenshot)'
		],
		'Map': [
			'Caption says "Trip Results: Alameda to Livermore" along with current day and time',
			'"clear" link is visible',
			'Trip path is drawn between A and B points',
			'Live traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'is visible and checked'
		],
		'"LIVE Traffic" map tab': [
			'Is visible, but collapsed'
		],
		'"Traffic Off" map tab': [
			'Is hidden'
		],
		'Map Toolbar': [
			'Settings match Live Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'SHOW AND HIDE TRIP RESULTS': { isComment: true, notes: 'if trip path is hidden, it will remain hidden when refreshing the page or reversing the trip, but when selecting another trip, it will be reset back to the checked state' }
});

// step 12
TestRunner.Steps.push({
	'Uncheck the "Show/Hide Route" map tab': {
		'Map': [
			'Trip path is hidden'
		]
	}
});

// step 13
TestRunner.Steps.push({
	'Check the "Show/Hide Route" map tab': {
		'Map': [
			'Trip path is visible'
		]
	}
});

TestRunner.Steps.push({
	'REVERSE A AND B POINTS': { isComment: true, notes: 'there may be some trips where this is not possible because data is not available from B to A' }
});

// step 14
TestRunner.Steps.push({
	'Click on the (TODO: icon) to reverse the A and B points': {
		'CDT Panel': [
			'Updated trip summary and details are displayed (TODO: screenshot)',
			'A and B points are reversed'
		],
		'Map': [
			'Caption is updated',
			'A and B points are reversed',
			'Trip path is drawn between A and B points',
			'Live traffic speed lines are visible'
		],
		'Url': [
			'Is changed to reflect reversed trip selections'
		]
	}
});

TestRunner.Steps.push({
	'REVISE THE ACTIVE TRIP USING "Your Trip" MENU': { isComment: true }
});

// step 15
TestRunner.Steps.push({
	'Click on "Revise" in the CDT Panel': {
		'CDT Panel': [
			'"Your Trip" menu options changed to "Return to Results" and "Clear"',
			'Step 1 of 3 text is visible',
			'Step 2 of 3 and dropdowns are visible and populated',
			'Step 3 of 3 and dropdowns are visible and populated'
		]
	}
});

// step 16
TestRunner.Steps.push({
	'Click on "Return to Results" in the CDT Panel': {
		'CDT Panel': [
			'"Your Trip" menu is changes back to"Revise", "New", and "Clear" options',
			'Step 1 of 3 text is hidden, but "Now" and "Specific Day and Time" radio buttons are visible',
			'Step 2 of 3 and dropdowns are hidden',
			'Step 3 of 3 and dropdowns are hidden'
		]
	}
});

TestRunner.Steps.push({
	'REPEAT #15': { isComment: true }
});

// step 17
TestRunner.Steps.push({
	'Change Step 3 of 3 cross road from "N Flynn Rd" to "N Livermore Ave"': {
		'CDT Panel': [
			'"Your Trip" menu is visible with "Revise", "New", and "Clear" options',
			'Step 1 of 3 text is hidden, but "Now" and "Specific Day and Time" radio buttons remain visible',
			'Step 2 of 3 and dropdowns are hidden',
			'Step 3 of 3 and dropdowns are hidden',
			'Updated trip summary and details are displayed (TODO: screenshot)'
		],
		'Map': [
			'Caption still says "Trip Results: Alameda to Livermore" along with current day and time',
			'Trip path is drawn between A and B points',
			'Live traffic speed lines are visible'
		],
		'Url': [
			'Is changed to reflect updated trip selections'
		]
	}
});

TestRunner.Steps.push({
	'CLICK ON SELECTED ROUTE': { isComment: true }
});

// step 18
TestRunner.Steps.push({
	'Click on currently selected route in the CDT Panel summary table': {
		'CDT Panel': [
			'Is unchanged'
		],
		'Map': [
			'Is unchanged'
		]
	}
});

TestRunner.Steps.push({
	'HOVER OVER ALTERNATE ROUTE': { isComment: true }
});

// step 19
TestRunner.Steps.push({
	'Hover over a route other than the currently selected route selected in the CDT Panel summary table': {
		'CDT Panel': [
			'Hovered route is highlighted in a lighter color than the currently selected route'
		],
		'Map': [
			'Hovered route trip path is drawn between A and B points for that route in a lighter color than the currently selected route'
		]
	}
});

// step 20
TestRunner.Steps.push({
	'Hover out of the route in the CDT Panel summary table': {
		'CDT Panel': [
			'Hovered route is highlight is removed'
		],
		'Map': [
			'Hovered route trip path is removed'
		]
	}
});

TestRunner.Steps.push({
	'CLICK ON  ALTERNATE ROUTE': { isComment: true }
});

// step 21
TestRunner.Steps.push({
	'Click on a route other than the currently selected route selected in the CDT Panel summary table': {
		'CDT Panel': [
			'Selected route is now the default',
			'Updated trip summary and details are displayed (TODO: screenshot)'
		],
		'Map': [
			'Selected route trip path is drawn between A and B points'
		],
		'Url': [
			'Is changed to reflect updated trip selections'
		]
	}
});

TestRunner.Steps.push({
	'CHANGE THE ACTIVE TRIP FROM LIVE TO PREDICTED TRIP': { isComment: true }
});

// step 22
TestRunner.Steps.push({
	'Click on "Specific Day and Time" radio button in the CDT Panel': {
		'CDT Panel': [
			'Day and Time selections are visible and set to current day/time',
			'Trip summary and details are updated, and "Current" column has been removed from both summary and detail tables'
		],
		'Map': [
			'Caption is changed from "Trip Results..." for current day/time to "Trip Results..." for predicted day/time (red color)',
			'Predicted traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"LIVE Traffic map tab': [
			'Is hidden'
		],
		'"PREDICTED Traffic" map tab': [
			'Is visible and collapsed'
		],
		'Map Toolbar': [
			'Settings match Predicted Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'CLEAR THE ACTIVE TRIP': { isComment: true }
});

// step 23
TestRunner.Steps.push({
	'Click on the "Clear" link in the CDT Panel "Your trip" menu': {
		'Recent Trips Panel': [
			'Is visible and expanded',
			'"Alameda to Livermore" trip is displayed with values for "Currently" and "Typical"'
		],
		'CDT Panel': [
			'Is collapsed'
		],
		'Map': [
			'Caption says "Current Traffic Conditions" for current day/time',
			'Trip path and A/B points are removed',
			'Live traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'Is hidden'
		],
		'"LIVE Traffic map tab': [
			'Is visible, but collapsed'
		],
		'"PREDICTED Traffic" map tab': [
			'Is hidden'
		],
		'Map Toolbar': [
			'Settings match Live Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'VERIFY THAT ACTIVE TRIP WAS MOVED TO RECENT TRIPS': { isComment: true, notes: '"Specific Day and Time" will be changed to "Now" when saved to recent trips' }
});

// step 24
TestRunner.Steps.push({
	'Click on "Alameda to Livermore" trip in Recent Trips panel': {
		'Recent Trips Panel': [
			'Trip summary and details are displayed (TODO: screenshot)',
			'"Now" radio button is selected by default'
		],
		'CDT Panel': [
			'Is collapsed'
		],
		'Map': [
			'Caption says "Trip Results: Alameda to Livermore" along with current day and time',
			'"clear" link is visible',
			'"Reset Map" link is visible',
			'A and B points and drawn',
			'Trip path is drawn between A and B points',
			'Live traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'is visible and checked'
		],
		'"Calculate Drive Times" map tab': [
			'is visible, but collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is visible, but collapsed'
		],
		'Map Toolbar': [
			'Settings match Live Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'CLOSE RECENT TRIP': { isComment: true }
});

// step 25
TestRunner.Steps.push({
	'Click on "Alameda to Livermore" trip in Recent Trips panel': {
		'Recent Trips Panel': [
			'Is expanded, but "Alameda to Livermore" trip summary and details are removed'
		],
		'CDT Panel': [
			'Is collapsed'
		],
		'Map': [
			'Is restored to default extent',
			'Caption says "Current Traffic Conditions" along with current day and time',
			'"clear" link is hidden',
			'"Reset Map" link is hidden',
			'A and B points are removed',
			'Trip path between A and B points is removed',
			'Live traffic speed lines are visible  (SEE: Bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'Is hidden'
		],
		'"Calculate Drive Times" map tab': [
			'Is visible, but collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is visible, but collapsed'
		],
		'Map Toolbar': [
			'Settings match Live Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'CHANGE RECENT TRIP FROM LIVE TO PREDICTED': { isComment: true, notes: 'Repeat #24 - Click on "Alameda to Livermore" trip in Recent Trips panel' }
});

// step 26
TestRunner.Steps.push({
	'Click on "Specific Day and Time" radio button in Recent Trips panel': {
		'Recent Trips Panel': [
			'Day and Time selections are visible and set to current day/time',
			'Trip summary and details are updated, and "Current" column has been removed from both summary and detail tables'
		],
		'CDT Panel': [
			'Is collapsed'
		],
		'Map': [
			'Caption says "Trip Results: Alameda to Livermore" along with predicted day and time',
			'"clear" link is visible',
			'"Reset Map" link is visible',
			'A and B points are drawn',
			'Trip path is drawn between A and B points',
			'Predicted traffic speed lines are visible (SEE: bookmarklet)'
		],
		'"Show/Hide Route" map tab': [
			'Is visible and checked'
		],
		'"Calculate Drive Times" map tab': [
			'Is visible, but collapsed'
		],
		'"LIVE Traffic map tab': [
			'Is hidden'
		],
		'"PREDICTED Traffic map tab': [
			'Is visible, but collapsed'
		],
		'Map Toolbar': [
			'Settings match Predicted Traffic settings (SEE: ViewState)'
		]
	}
});

TestRunner.Steps.push({
	'CLOSE RECENT TRIP ("Specific Day and Time" will be changed back to "Now")': { isComment: true, notes: 'Repeat #25 - Click on "Alameda to Livermore" trip in Recent Trips panel' }
});

TestRunner.Steps.push({
	'TODO: CREATE A NEW TRIP USING THE CDT MAP TAB (LIVE TRAFFIC)': { isComment: true }
});

TestRunner.Steps.push({
	'TODO: VERIFY MAP TOOLBAR FUNCTIONALITY': { isComment: true }
});
