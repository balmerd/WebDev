$(function () {

	$('#tabs').tabs();

	$('#create-category').button({
		text: false,
		icons: {
			secondary: 'ui-icon-plus'
		}
	}).click(function () {
		$('#dialog-create-category').dialog('open');
	});

	$('#kanban').kanbanBoard({
		storeKey: 'test'
	});

	$('table').on('click', 'th.clickable', function () {
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
			'Create category': function () {
				if ($('#kanban').kanbanBoard('createCategory', $('#category-name'))) {
					$(this).dialog('close');
				}
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
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
			'Delete category': function () {
				$('th[data-key="{0}"]'.format(selectedCategory)).remove();
				$('ul#{0}'.format(selectedCategory)).parent().remove();
				saveCategories();
				$(this).dialog('close');
			},
			Cancel: function () {
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
			'Create task': function () {
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
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
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
			'Save task': function () {
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
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
			tips.hide();
			selectedTask$ = null;
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	$('#dialog-create-user').dialog({
		autoOpen: false,
		width: 350,
		height: 350,
		modal: true,
		buttons: {
			'Create user': function () {
				var bValid = true,
					name = $('#user-name'),
					email = $('#user-email'),
					password = $('#user-password');
				allFields = $([]).add(name).add(email).add(password);
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(name, 'Username', 3, 16);
				bValid = bValid && checkLength(email, 'Email', 6, 80);
				bValid = bValid && checkLength(password, 'Password', 5, 16);
				bValid = bValid && checkRegexp(name, /^[a-z]([0-9a-z_])+$/i, 'Username may consist of a-z, 0-9, underscores, begin with a letter.');
				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, 'eg. ui@jquery.com');
				bValid = bValid && checkRegexp(password, /^([0-9a-zA-Z])+$/, 'Password field only allow : a-z 0-9');
				if (bValid) {
					//$('#users tbody').append('<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>'.format(name.val(), email.val(), password.val()));
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
			tips.hide();
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

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