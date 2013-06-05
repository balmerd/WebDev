window.App = Ember.Application.create({
	ready: function() { // similar to $(document).ready() for the Application instance

		App.Item = Ember.Object.extend({
			location: null,
			activity: null,
			selected: false,
			description: function() { // computed property
				return 'We are %@1 in %@2'.fmt(this.activity, this.location); // "fmt" is a string prototype provide by Ember
			}.property('activity', 'location') // bound template item will be updated if either of these change
		});

		App.model = Ember.ArrayProxy.create({
			content: [
                App.Item.create({ location: 'Sonora Pass', activity: 'Camping', selected: true }),
                App.Item.create({ location: 'Mt. Tamalpais', activity: 'Hiking' }),
                App.Item.create({ location: 'San Francisco Bay', activity: 'Kayaking' })
			],
			changeLocation: function(value) {
				this.findProperty('selected', true).set('location', value);
			}
		});

		App.RowView = Ember.View.extend({ // an instance of this view is created for each row using the {{#view}} helper
			classNameBindings: ['this.bindingContext.selected'],
			parentContentBinding: 'this._parentView.bindingContext.content',
			click: function(evt) {
				this.parentContent.setEach('selected', false);				// de-select previously selected row
				this.bindingContext.set('selected', true);					// select this row
				$('#selection').text(JSON.stringify(this.bindingContext));	// show json data
			}
		});

		App.controller = Ember.Controller.create({
			init: function() { // this constructor is called automatically when controller is created
				this.view = Ember.View.create({
					templateName: 'exampleTemplate',						// Ember will look for data-template-name="exampleTemplate"
					contentBinding: 'App.model.content'						// so that {{#each content}} in the template will refer to "App.model.content"
				}).appendTo('#container');
			}
		});

		$('#btnAdd').click(function() {
			App.model.pushObject(App.Item.create({ location: 'Oakland', activity: 'Testing' }));
		});

		$('#btnRemove').click(function() {
			App.model.popObject();
		});

		$('#btnChange').click(function() {
			App.model.changeLocation($('input').val());
		});
	}
});