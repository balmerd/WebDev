$(function () {
	var allFields;
	var TRASH = 'TRASH';
	var selectedCategory;
	var tips = $('.validateTips');

	var columnNum = 1;

	var categories = {
		'511Traffic' :		{ name: '511 Traffic', tasks: [
			"fubar",
			"snafu"
		]},
		'IRADMobile' :		{ name: 'IRAD Mobile', tasks: []},
		'DCOL2' :			{ name: 'DCOL2', tasks: []},
		'Migration' :		{ name: 'Migration', tasks: []},
		'ReleaseReady' :	{ name: 'Release Ready', tasks: []}
	};

	function appendList(list, task) {
		list.append('<li><div class="box"><div class="handle">&nbsp;</div>&nbsp;<span class="editable">{0}</span></div></li>'.format(task));
	}

	function createList(col, key, tasks) {
		var list = $('<ul id="{0}" class="sortable connectedSortable col{1}"></ul>'.format(key, col));
		$.each(tasks, function(taskIndex, task) {
			appendList(list, task);
		});
		return list;
	}

	function createColumn(key, obj) {
		$('thead tr').append('<th class="clickable" data-key="{0}">{1}<div class="ui-icon ui-icon-closethick delete-icon"></div></th>'.format(key, obj.name));
		$('tbody tr').append($('<td></td>').append(createList(columnNum++, key, obj.tasks)));
	}

	function createBoard() {
		var table = $('#board table');
		for (key in categories) {
			if (key !== TRASH) {
				if (categories.hasOwnProperty(key)) {
					table.append(createColumn(key, categories[key]));
				}
			}
		}
	}

	function updateTips(t) {
		tips.text(t).addClass('ui-state-highlight');
		setTimeout(function () {
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
			updateTips('Length of {0} must be between {1} and {2}.'.format(n, min, max));
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
				//save_tasks();
				console.log('moved');
			}
		}).disableSelection();
	}

	$('#tabs').tabs();

	$('#create-task').button({
		text: false,
		icons: {
			secondary: 'ui-icon-plus'
		}
	}).click(function () {
		$('#dialog-create-category').dialog('open');
	});

	$('table').on('click', 'th.clickable', function () {
		var data = $(this).data();
		var name = $(this).text();
		selectedCategory = data.key;
		$('#dialog-create-task').dialog('option', 'title', 'Create new Task for "{0}"'.format(name));
		$('#dialog-create-task').dialog('open');
	}).on('click', '.delete-icon', function() {
		var data = $(this).parent().data();
		var name = $(this).parent().text();
		selectedCategory = data.key;
		$('#dialog-delete-category').dialog('option', 'title', 'Delete Category "{0}"'.format(name));
		$('#dialog-delete-category').dialog('open');
		return false;
	});

	$('#dialog-create-category').dialog({
		autoOpen: false,
		width: 350,
		height: 250,
		modal: true,
		buttons: {
			'Create category': function () {
				var bValid = true, key,
					name = $('#category-name');
				allFields = $([]).add(name);
				allFields.removeClass('ui-state-error');
				key = name.val().replace(' ', '');
				bValid = bValid && checkLength(name, 'category name', 3, 16);
				bValid = bValid && checkExistingID(name, key, 'category name');
				if (bValid) {
					$('thead tr').append('<th class="clickable" data-key="{1}"><div>{0}<div class="ui-icon ui-icon-closethick delete-icon"></div></th>'.format(name.val(), key));
					$('tbody tr').append('<td><ul class="sortable connectedSortable" id="{0}"></td>'.format(key));
					bindSortables();
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
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
				$('ul#{0}'.format(selectedCategory)).parent().remove();;
				selectedCategory = null;
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
		height: 250,
		modal: true,
		buttons: {
			'Create task': function () {
				var bValid = true,
					name = $('#task-name');
				allFields = $([]).add(name);
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(name, 'task name', 3, 16);
				if (bValid) {
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		},
		close: function () {
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
				bValid = bValid && checkLength(name, 'username', 3, 16);
				bValid = bValid && checkLength(email, 'email', 6, 80);
				bValid = bValid && checkLength(password, 'password', 5, 16);
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
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	createBoard();
	bindSortables();
});