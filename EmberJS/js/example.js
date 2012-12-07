// http://jsfiddle.net/remlab/YemS7/

var Example = Ember.Namespace.create({
	Views: {} // could have multiple views sharing the same model, but just one for now...
});

Example.Item = Ember.Object.extend({
	location: null,
	activity: null
});

Example.Controller = Ember.Controller.extend({
	init: function() { // called when controller is created
		this.model = Ember.ArrayProxy.create({
			content: [
                Example.Item.create({ location: 'Sonora Pass', activity: 'Camping' }),
                Example.Item.create({ location: 'Mt. Tamalpais', activity: 'Hiking' }),
                Example.Item.create({ location: 'San Francisco Bay', activity: 'Kayaking' })
			]
		});
		this.view = Example.Views.Module.create(this.viewOptions);
	},
	ready: function() { // called after controller is created so binding will work
		this.view.appendTo(this.view.container);
		return this; // make it chainable
	}
});

Example.Views.Module = Ember.View.extend({
	templateName: 'exampleModule',
	didInsertElement : function() { // called when template has been added to the DOM
		// bind "content" property to "App.controller.model"
		// so that {{#each content}} in the template will refer to "App.controller.model.content"
		Ember.bind(this, 'content', this.contentPath);

		// this.$() refers to the jQuery wrapped DOM element containing this view
		// .on() is required because the 'tr' elements will not exist until Ember.bind() is done
		this.$().on('mouseover', 'tr', function() {
			$(this).addClass('hover');
		}).on('mouseout', 'tr', function() {
			$(this).removeClass('hover');
		});
	}
});

window.App = Ember.Application.create({
	ready: function() {
		this._super(); // Ember housekeeping
		App.controller = Example.Controller.create({
			viewOptions: {
				container: '#example',
				contentPath: 'App.controller.model'
			}
		}).ready();
	}
});
