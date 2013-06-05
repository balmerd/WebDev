$(function() {
	var allFields;
	var categories;
	var TRASH = 'TRASH';
	var columnNum = 1;
	var selectedTask$;
	var selectedCategory;
	var tips = $('.validateTips');
	var storeKeys$ = $('#store-keys');
	var STORE_KEY = storeKeys$.val();
	var store = Lawnchair({ adapter: 'dom' }, $.noop);

	var _save = function() {
		store.save({ key: STORE_KEY, value: categories });
	};

	function loadData() {
		store.get(STORE_KEY, function(obj) {
			//obj = null; // uncomment to use static values below
			if (obj) { // get saved content
				categories = obj.value;
			} else {
				categories = {};
				//categories = {"511Traffic":{"name":"511 Traffic","tasks":[]},"ReleaseReady":{"name":"Release Ready","tasks":["Bug 1394 - Update cameras on traffic website","OPT 1399 - Add toll bridge info to Traffic map","O & M 1400 - Add Park and Ride lots to Traffic map","OPT 1403 - scale map icons based on zoom level","O & M 1415 - Provide error messages on Traffic page when Caltrans CMS feed is down","OPT 1416 - Develop CMS text page for 511 Traffic and TIC use","OPT 1436 - Update Twitter feed API","Bug 1470 - Map reload fails while ambiguous results list is shown","Bug 1474 - Add feature to allow deactivation of CMS signs from TIC admin","O & M 1482 - Inconsistency in display of current and typical times when the time values are the same","About 511 Parking page update","TW4 testing comments_March22","Comments on FasTrak Section March 22 2013"]},"TRASH":[]};
			}
			categories[TRASH] = []; // empty out the trash
			_save();
		});
	}

	function saveCategories() {
		categories = {};
		$('#kanban ul[data-name]').each(function() {
			var key = $(this).attr('id');
			categories[key] = { name: $(this).attr('data-name'), tasks: [] };
			$('ul#{0} .editable'.format(key)).each(function() {
				categories[key].tasks.push($(this).text());
			});
		});
		_save();
	}

	function appendList(list, task) {
		list.append('<li><div class="box"><div class="handle">&nbsp;</div>&nbsp;<span class="editable">{0}</span></div></li>'.format(task));
	}

	function createList(col, key, category) {
		var list = $('<ul id="{0}" data-name="{1}" class="sortable connectedSortable col{2}"></ul>'.format(key, category.name, col));
		$.each(category.tasks, function(taskIndex, task) {
			appendList(list, task);
		});
		return list;
	}

	function createColumn(key, category) {
		$('thead tr').append('<th class="clickable removable" data-key="{0}">{1}<div class="ui-icon ui-icon-closethick delete-icon"></div></th>'.format(key, category.name));
		$('tbody tr').append($('<td class="removable"></td>').append(createList(columnNum++, key, category)));
	}

	function createBoard() {
		var i, key, keys = [];
		var $table = $('#kanban table');
		for (key in categories) {
			if (key !== TRASH) {
				if (categories.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
		}
		keys.sort();
		$table.find('td.removable').remove();
		$table.find('th.removable').remove();
		for (i = 0; i < keys.length; i++) {
			$table.append(createColumn(keys[i], categories[keys[i]]));
		}
	}

	function updateTips(t) {
		tips.text(t).addClass('ui-state-highlight').show();
		setTimeout(function() {
			tips.removeClass('ui-state-highlight', 1500);
		}, 500);
	}

	function checkExistingID(o, key) {
		if ($('#' + key).length > 0) {
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

	$('#create-category').button({
		text: false,
		icons: {
			secondary: 'ui-icon-plus'
		}
	}).click(function() {
		$('#dialog-create-category').dialog('open');
	});

	$('table').on('click', 'th.clickable', function() {
		var data = $(this).data();
		var name = $(this).text();
		selectedCategory = data.key;
		$('#dialog-create-task').dialog('option', 'title', 'Create "{0}" Task'.format(name));
		$('#dialog-create-task').dialog('open');
	}).on('click', '.delete-icon', function() {
		var data = $(this).parent().data();
		var name = $(this).parent().text();
		selectedCategory = data.key;
		$('#dialog-delete-category').dialog('option', 'title', 'Delete Category "{0}"'.format(name));
		$('#dialog-delete-category').dialog('open');
		return false;
	}).on('click', 'span.editable', function() {
		selectedTask$ = $(this);
		$('#edit-task-desc').val(selectedTask$.text());
		$('#dialog-edit-task').dialog('open');
	});

	$('#dialog-create-category').dialog({
		autoOpen: false,
		width: 350,
		height: 250,
		modal: true,
		buttons: {
			'Create category': function() {
				var bValid = true, key,
					categoryName = $('#category-name');
				allFields = $([]).add(categoryName);
				allFields.removeClass('ui-state-error');
				key = categoryName.val().replace(' ', '');
				bValid = bValid && checkLength(categoryName, 'Name', 3, 16);
				bValid = bValid && checkExistingID(categoryName, key, 'Name');
				if (bValid) {
					createColumn(key, { name: categoryName.val(), tasks: [] });
					bindSortables();
					saveCategories();
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		//		open: function() {
		//			console.log('open');
		//			$('#dialog-create-category').keypress(function(evt) {
		//				if (evt.keyCode == $.ui.keyCode.ENTER) {
		//					$(this).parent().find('button:eq(0)').trigger('click');
		//				}
		//			});
		//		},
		close: function() {
			tips.hide();
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	$('#dialog-delete-category').dialog({
		autoOpen: false,
		width: 350,
		height: 150,
		modal: true,
		buttons: {
			'Delete category': function() {
				$('th[data-key="{0}"]'.format(selectedCategory)).remove();
				$('ul#{0}'.format(selectedCategory)).parent().remove();
				saveCategories();
				$(this).dialog('close');
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		}
	});

	$('#dialog-create-task').dialog({
		autoOpen: false,
		width: 350,
		height: 350,
		modal: true,
		buttons: {
			'Create task': function() {
				var bValid = true,
					taskDesc = $('#new-task-desc');
				allFields = $([]).add(taskDesc);
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(taskDesc, 'Description', 1, 255);
				if (bValid) {
					var list = $('ul#{0}'.format(selectedCategory));
					appendList(list, taskDesc.val());
					saveCategories();
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			tips.hide();
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	$('#dialog-edit-task').dialog({
		autoOpen: false,
		width: 350,
		height: 350,
		modal: true,
		buttons: {
			'Save task': function() {
				var bValid = true,
					taskDesc = $('#edit-task-desc');
				allFields = $([]).add(taskDesc);
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(taskDesc, 'Description', 1, 255);
				if (bValid) {
					selectedTask$.text(taskDesc.val());
					selectedTask$ = null;
					saveCategories();
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			tips.hide();
			selectedTask$ = null;
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	//	$('#dialog-create-user').dialog({
	//		autoOpen: false,
	//		width: 350,
	//		height: 350,
	//		modal: true,
	//		buttons: {
	//			'Create user': function () {
	//				var bValid = true,
	//					name = $('#user-name'),
	//					email = $('#user-email'),
	//					password = $('#user-password');
	//				allFields = $([]).add(name).add(email).add(password);
	//				allFields.removeClass('ui-state-error');
	//				bValid = bValid && checkLength(name, 'Username', 3, 16);
	//				bValid = bValid && checkLength(email, 'Email', 6, 80);
	//				bValid = bValid && checkLength(password, 'Password', 5, 16);
	//				bValid = bValid && checkRegexp(name, /^[a-z]([0-9a-z_])+$/i, 'Username may consist of a-z, 0-9, underscores, begin with a letter.');
	//				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
	//				bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, 'eg. ui@jquery.com');
	//				bValid = bValid && checkRegexp(password, /^([0-9a-zA-Z])+$/, 'Password field only allow : a-z 0-9');
	//				if (bValid) {
	//					//$('#users tbody').append('<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>'.format(name.val(), email.val(), password.val()));
	//					$(this).dialog('close');
	//				}
	//				allFields = null;
	//			},
	//			Cancel: function () {
	//				$(this).dialog('close');
	//			}
	//		},
	//		close: function () {
	//			tips.hide();
	//			if (allFields) {
	//				allFields.val('').removeClass('ui-state-error');
	//			}
	//		}
	//	});

	loadData();
	createBoard();
	bindSortables();

	$('#json-button').click(function() {
		var _SHOW = "Show JSON data"
		var _HIDE = "Hide JSON data";
		if ($(this).text() === _SHOW) {
			$('#json-data').text(JSON.stringify(categories)).removeClass('hidden');
			$(this).text(_HIDE);
		} else {
			$('#json-data').empty();
			$(this).text(_SHOW);
		}
	}).removeClass('hidden');

	storeKeys$.change(function() {
		STORE_KEY = $(this).val();
		loadData();
		createBoard();
		bindSortables();
	});

	//    $('th.clickable').contextPopup({
	//        title: 'Category Actions', items: [
	//			{ label:'Some Item',     icon:'icons/shopping-basket.png',             action:function() { alert('clicked 1') } },
	//			{ label:'Another Thing', icon:'icons/receipt-text.png',                action:function() { alert('clicked 2') } },
	//			{ label:'Blah Blah',     icon:'icons/book-open-list.png',              action:function() { alert('clicked 3') } },
	//	        null, // divider
	//			{ label:'Sheep',         icon:'icons/application-monitor.png',         action:function() { alert('clicked 4') } },
	//			{ label:'Cheese',        icon:'icons/bin-metal.png',                   action:function() { alert('clicked 5') } },
	//			{ label:'Bacon',         icon:'icons/magnifier-zoom-actual-equal.png', action:function() { alert('clicked 6') } },
	//			null, // divider
	//			{ label:'Onwards',       icon:'icons/application-table.png',           action:function() { alert('clicked 7') } },
	//			{ label:'Flutters',      icon:'icons/cassette.png',                    action:function() { alert('clicked 8') } }
	//        ]
	//    });

	//    $('div.box').contextPopup({
	//        title: 'Task Actions', items: [
	//			{ label:'Edit Item',     icon:'icons/shopping-basket.png',             action:function(evt) {
	//				//var foo = $(this).find('.editable');
	//				//$(this).find('.editable').trigger('click');
	//				alert(evt.target.textContent);
	//			}},
	//			{ label:'Another Thing', icon:'icons/receipt-text.png',                action:function() { alert('clicked 2') } },
	//			{ label:'Blah Blah',     icon:'icons/book-open-list.png',              action:function() { alert('clicked 3') } },
	//	        null, // divider
	//			{ label:'Sheep',         icon:'icons/application-monitor.png',         action:function() { alert('clicked 4') } },
	//			{ label:'Cheese',        icon:'icons/bin-metal.png',                   action:function() { alert('clicked 5') } },
	//			{ label:'Bacon',         icon:'icons/magnifier-zoom-actual-equal.png', action:function() { alert('clicked 6') } },
	//			null, // divider
	//			{ label:'Onwards',       icon:'icons/application-table.png',           action:function() { alert('clicked 7') } },
	//			{ label:'Flutters',      icon:'icons/cassette.png',                    action:function() { alert('clicked 8') } }
	//        ]
	//    });
});