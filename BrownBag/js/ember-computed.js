
window.App = Ember.Application.create({
	ready: function() { // called when the DOM is ready like $(document).ready()

		App.item = Ember.Object.extend({
			location: null,
			activity: null,
			description: function() { // computed property
				return 'We are ' + this.activity + ' in ' + this.location;
			}.property('activity', 'location') // template item will be updated if either of these change
		});

		App.model = Ember.ArrayProxy.create({
			content: [
                App.item.create({ location: 'Sonora Pass', activity: 'Camping' }),
                App.item.create({ location: 'Mt. Tamalpais', activity: 'Hiking' }),
                App.item.create({ location: 'San Francisco Bay', activity: 'Kayaking' })
			]
		});

		App.rowView = Ember.View.extend({
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
			App.model.pushObject(App.item.create({ location: 'Oakland', activity: 'Testing' }));
		});

		$('#btnRemove').click(function() {
			App.model.popObject();
		});
	}
});
