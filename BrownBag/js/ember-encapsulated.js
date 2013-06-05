
var Example = Ember.Namespace.create({
    Views: {}
});

Example.Item = Ember.Object.extend({ // an instance of this object will be created for each row
    location: null,
    activity: null,
	description: function() { // computed property
		return 'We are %@1 in %@2'.fmt(this.activity, this.location); // "fmt" is a string prototype provide by Ember.js
	}.property('location', 'activity')
});

Example.Views.ClickableRow = Ember.View.extend({ // an instance of this view is created for each row using the {{#view}} helper
    clicked: function(evt) {
		$('#selection').text(JSON.stringify(this._context)); // "this._context" refers to the Example.Item for this row
		alert(this._context.get('description')); // get the computed property value
    }
});

Example.Views.Module = Ember.View.extend({
	contentPath: null,
    templateName: 'exampleTemplate',
    didInsertElement : function() { // called when template has been added to the DOM
        // bind "content" property to "App.controller.model"
        // so that {{#each content}} in the template will refer to "App.controller.model.content"
        Ember.bind(this, 'content', this.contentPath);
    }
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
        this.view.appendTo(this.view.container); // add template to DOM (will trigger didInsertElement)
		return this; // chaining required so that App.controller refers to "this" instance
    },
	addRow: function() {
		this.model.pushObject(Example.Item.create({ location: 'Oakland', activity: 'Testing' }));
	},
	removeRow: function() {
		this.model.popObject();
	},
	changeLocation: function(value) {
		this.model.objectAt(0).set('location', value);
	}
});

window.App = Ember.Application.create({
    ready: function() {
        App.controller = Example.Controller.create({
            viewOptions: {
                container: '#container',
                contentPath: 'App.controller.model.content'
            }
        }).ready();
		
		$('#btnAdd').click(function() {
			App.controller.addRow()
		});
		
		$('#btnRemove').click(function() {
			App.controller.removeRow();
		});

		$('#btnChange').click(function() {
			App.controller.changeLocation($('input').val());
		});
    }
});