TestRunner.Steps.push({
	'TESTCASES BASED ON RECENT BUGS': { isComment: true }
});


TestRunner.Steps.push({
	'Test new releases against web sessions using old website version': {
		'JavaScript Caching Issue': [
			'Users should not be required to refresh the page or flush their browser cache.'
		]
	}
});


TestRunner.Steps.push({
	'Test with cookies DISABLED - should be able to do everything, EXCEPT:': {
		'RecentTrips': [
			'Will not be saved'
		],
		'Map': [
			'Will not remember manual extent changes'
		],
		'Map Toolbar': [
			'Settings will not be saved'
		]
	}
});

TestRunner.Steps.push({
	'Revise a valid trip, selecting a starting point that is not valid for the current end point': {
		'CDT Panel': [
			'Enter starting point "Alameda"',
			'Enter ending point "Moss Beach"',
			'Click on Revise and change starting point to "Suisun City"',
			'Step 2 of 3 should show all values for "Suisun City", and Step 3 of 3 should be cleared and end nodes displayed on the map'
		]
	}
});

TestRunner.Steps.push({
	'LatestNews page should be expanded by default': {
		'Expand and Collapse settings': [
			'Should be remembered between refreshes'
		]
	}
});

TestRunner.Steps.push({
	'On a Predicted Trip, click on "Reset Map" link': {
		'Recent Trips Panel': [
			'Should be expanded'
		]
	}
});

TestRunner.Steps.push({
	'Bug 1378 - Typical Speed in CDT Results': {
		'CDT Panel': [
			'Select Milpitas I-880 & CA-237 to Santa Clara US-101 & San Tomas Expy',
			'Montague Expressway was showing typical speed of 110mph, but should be limited by mean speed'
		]
	}
});

TestRunner.Steps.push({
	'With Recent Trips populated, start new trip and switch Current Trip from "Now" to "Specific Day and Time", then switch back to "Now"': {
		'CDT Panel': [
			'Should remain expanded (was closing)'
		]
	}
});
