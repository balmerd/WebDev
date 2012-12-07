
var TestRunner = { // create namespace
	Steps: []
};

TestRunner.Data = (function() {
	// private methods
	function attachFeatures(obj) {
		var data = [];
		var featureName;
		for (featureName in obj) {
			if (obj.hasOwnProperty(featureName)) {
				data.push({
					name: featureName,
					assertions: obj[featureName]
				});
			}
		}
		return data;
	}
	return { // public interface
		load: function(testcases) { // reformat simplified test step notation for rendering with template
			var data = [];
			var stepName, stepIndex = 1;
			$.each(TestRunner.Steps, function(index, step) {
				for (stepName in step) {
					if (step.hasOwnProperty(stepName)) {
						if (step[stepName].isComment) {
							data.push({
								name: stepName,
								isComment: true,
								notes: step[stepName].notes || ''
							});
						} else {
							data.push({
								name: stepName,
								step: ((stepIndex++) + ')'),
								features: attachFeatures(step[stepName])
							});
						}
					}
				}	
			});
			return data;
		}
	}
}()); // self-instantiation

$(function() {
	var context;
	var container = '#tester';
	var template = Handlebars.compile($('#testRunnerModule').html());

	var bookmarkletDialog = $('#bookmarklet-dialog').dialog({
		modal: true,
		autoOpen: false,
		width: 500, height: 150,
		title: 'Paste this into your browser'
	});

	var viewStateDialog = $('#viewstate-dialog').dialog({
		modal: true,
		autoOpen: false,
		width: 400, height: 350,
		title: 'Traffic ViewStates'
	});

	$('#bookmarklet').click(function() {
		bookmarkletDialog.dialog('open');
		return false;
	});

	$('#viewstate').click(function() {
		viewStateDialog.dialog('open');
		return false;
	});

	$('button').button().click(function() {
		TestRunner.Steps = [];
		$.getScript($(this).attr('data-script'), function() {
			context = { content: TestRunner.Data.load(TestRunner.Steps) };
			$(container).html(template(context)); // render template with data context
			setTimeout(function() {
				$(container).removeClass('hidden');
			}, 500);
		});
	}).removeClass('hidden');
});
