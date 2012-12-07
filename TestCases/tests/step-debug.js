
TestRunner.Steps.push({
	'INITIAL PAGE LOAD with CLEAR CACHE and DATA AVAILABLE': {
		'LatestNews Panel': [
			'is visible and expanded',
			'news items are not expanded'
		],
		'Recent Trips Panel': [
			'is hidden'
		],
		'CDT Panel': [
			'is visible and expanded',
			'"Now" radio button is selected',
			'"Select Start" is visible and enabled',
			'"Select End" is visible, but disabled'
		],
		'Map': [
			'is not expanded',
			'caption says "Current Traffic Conditions..."',
			'"Reset Map" link is hidden',
			'Live traffic speed lines are visible'
		],
		'"Calculate Drive Times" map tab': [
			'is visible and collapsed'
		],
		'"LIVE Traffic map tab': [
			'is visible and collapsed'
		],
		'"PREDICTED Traffic" map tab': [
			'is hidden'
		],
		'Map Toolbar': [
			'settings match Live Traffic settings'
		],
		'Footer': [
			'is collapsed'
		]
	}
});

//function debug() {
//	console.clear();
//	$.each(TestRunner.Steps, function(stepIndex, step) {
//		for (stepName in step) {
//			if (step.hasOwnProperty(stepName)) {
//				// add step
//				console.log(stepName);
//				for (featureName in step[stepName]) {
//					if (step[stepName].hasOwnProperty(featureName)) {
//						// add feature
//						console.log('-	' + featureName);
//						$.each(step[stepName][featureName], function() {
//							// add assertions
//							console.log('	-	' + this);
//						});
//					}
//				}
//			}
//		}
//	});
//}