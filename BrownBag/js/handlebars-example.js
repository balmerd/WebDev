$(document).ready(function() {

	var data = {
		content : [
			{ location: 'Sonora Pass', activity: 'Camping' },
			{ location: 'Mt. Tamalpais', activity: 'Hiking' },
			{ location: 'San Francisco Bay', activity: 'Kayaking' }
		]
	};

	var template = Handlebars.compile($('#exampleTemplate').html());

	$('#container').html(template(data)); // render template with data

	$('#container').on('click', 'tr:has(td)', function() { // bind click event on data row
		console.log('clicked on a row');
		$('#selection').html($(this).html());
	});

	$('#btnAdd').click(function() {
		data.content.push({ location: 'Oakland', activity: 'Testing' });
		$('#container').html(template(data));
	});

	$('#btnRemove').click(function() {
		data.content.pop();
		$('#container').html(template(data));
	});

});
