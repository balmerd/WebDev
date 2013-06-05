(function($) {

	var dataKey = 'KANBAN';

	var allFields;
	var categories;
	var TRASH = 'TRASH';
	var columnNum = 1;
	var selectedTask$;
	var selectedCategory;
	var tips = $('.validateTips');
	
	var store = Lawnchair( {adapter: 'dom'}, $.noop);

	var settings = { // default values
		storeKey: 'test'
	};

	var $this;

	// private methods

	function save() {
		store.save({ key: settings.storeKey, value: categories });
	}

	function saveCategories() {
		categories = {};
		$this.find('ul[data-name]').each(function() {
			var key = $(this).attr('id');
			categories[key] = { name: $(this).attr('data-name'), tasks: [] };
			$(this).find('.editable').each(function() {
				categories[key].tasks.push($(this).text());
			});
		});
		save();
	}

	function appendList(list, task) {
		list.append('<li><div class="box"><div class="handle">&nbsp;</div>&nbsp;<span class="editable">{0}</span></div></li>'.format(task));
	}

	function createList(col, key, category) {
		var list = $('<ul data-name="{0}" class="{1} sortable connectedSortable col{2}"></ul>'.format(category.name, key, col));
		$.each(category.tasks, function(taskIndex, task) {
			appendList(list, task);
		});
		return list;
	}

	function createColumn(key, category) {
		$('thead tr').append('<th class="clickable" data-key="{0}">{1}<div class="ui-icon ui-icon-closethick delete-icon"></div></th>'.format(key, category.name));
		$('tbody tr').append($('<td></td>').append(createList(columnNum++, key, category)));
	}

	function createBoard() {
		var i, key, keys = [];
		var table = $this.find('table');
		for (key in categories) {
			if (key !== TRASH) {
				if (categories.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
		}
		keys.sort();
		for (i=0; i<keys.length; i++) {
			table.append(createColumn(keys[i], categories[keys[i]]));
		}
	}

	function updateTips(t) {
		tips.text(t).addClass('ui-state-highlight').show();
		setTimeout(function () {
			tips.removeClass('ui-state-highlight', 1500);
		}, 500);
	}

	function checkExistingID(o, key) {
		if ($('.' + key).length > 0) {
			o.addClass('ui-state-error').focus();
			updateTips('"{0}" already exists.'.format(key));
			return false;
		} else {
			return true;
		}
	}

	function checkLength(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass('ui-state-error').focus();
			updateTips('{0} must be between {1} and {2} characters.'.format(n, min, max));
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp(o, regexp, n) {
		if (!(regexp.test(o.val()))) {
			o.addClass('ui-state-error');
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}

	function bindSortables() {
		$('.sortable').sortable({
			handle: '.handle',
			connectWith: '.connectedSortable',
			stop: function(evt, ui) { // drag is done
				saveCategories();
			}
		}).disableSelection();
	}

	// public methods

	var methods = {
		init: function(options) { 
			$this = $(this);
//			var data = $this.data(dataKey);

			$.extend(true, settings, options);

			store.get(settings.storeKey, function(obj) {
				//obj = null; // uncomment to use static values below
				if (obj) { // get saved content
					categories = obj.value;
				} else {
					categories = {
						"Testing": { "name": "Testing", "tasks": [
							"Send email about requirements and content",
							"Number of logged-in users will tracked by User table."
						]}
					};
				}
				categories[TRASH] = []; // empty out the trash
				save();
			});

//			if (!data) { // not initialized yet
//				$(this).data(dataKey, {
//					target : $this,
//					fubar : {}
//				});
//			}

			createBoard();
			bindSortables();
		},
		createCategory: function(categoryName) {
			var bValid = true, key;
			allFields = $([]).add(categoryName);
			allFields.removeClass('ui-state-error');
			key = categoryName.val().replace(' ', '');
			bValid = bValid && checkLength(categoryName, 'Name', 3, 24);
			bValid = bValid && checkExistingID(categoryName, key, 'Name');
			if (bValid) {
				createColumn(key, { name: categoryName.val(), tasks: []});
				bindSortables();
				saveCategories();
			}
			allFields = null;
			return bValid;
		},
		deleteCategory: function() { 
		},
		update: function(content) { 
		},
		destroy: function() {
//			var data = $this.data(dataKey);
//			data.fubar.remove();
//			$this.removeData(dataKey);
			$this = null;
		}
	};

	$.fn.kanbanBoard = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kanbanBoard');
		}    
	};

})(jQuery);
