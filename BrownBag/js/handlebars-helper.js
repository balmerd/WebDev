$(document).ready(function() {

	var data = {
		content : [
			{ location: 'Sonora Pass', activity: 'Camping' },
			{ location: 'Mt. Tamalpais', activity: 'Hiking' },
			{ location: 'San Francisco Bay', activity: 'Kayaking' }
		]
	};

	var template = Handlebars.compile($('#exampleTemplate').html());

	// Handlebars HTML-escapes values returned by a {{expression}}.
	// If you don't want Handlebars to escape a value, use {{{expression}}} 

	Handlebars.registerHelper('description', function() {
		return 'We are ' + this.activity + ' in ' + this.location;
		// If your helper returns HTML that you do not want escaped, make sure to return a new Handlebars.SafeString
		//return new Handlebars.SafeString('We are ' + this.activity + ' in <a href="http://lipsum.com/">' + this.location + '</a>');
	});

	$('#container').html(template(data)); // render template with data

	$('#container').on('click', 'tr:has(td)', function() {
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
