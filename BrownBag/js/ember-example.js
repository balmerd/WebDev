
window.App = Ember.Application.create({
	ready: function() { // similar to $(document).ready() for the Application instance

		Handlebars.registerHelper('description', function() {
			return 'We are ' + this.activity + ' in ' + this.location;
		});

		App.model = Ember.ArrayProxy.create({
			content: [
                { location: 'Sonora Pass', activity: 'Camping' },
                { location: 'Mt. Tamalpais', activity: 'Hiking' },
                { location: 'San Francisco Bay', activity: 'Kayaking' }
			]
		});

		App.RowView = Ember.View.extend({
			clicked: function(evt) {
				$('#selection').text(JSON.stringify(this._context));
			}
		});

		App.controller = Ember.Controller.create({
			init: function() { // called when controller is created
				this.view = Ember.View.create({
					templateName: 'exampleTemplate',
					contentBinding: 'App.model.content' // so that {{#each content}} in the template will refer to "App.model.content"
				}).appendTo('#container');
			}
		});

		$('#btnAdd').click(function() {
			App.model.pushObject({ location: 'Oakland', activity: 'Testing' });
		});

		$('#btnRemove').click(function() {
			App.model.popObject();
		});
	}
});
