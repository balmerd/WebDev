$(function() {
	var allFields;
	var categories;
	var columnNum = 1;
	var selectedCategory;

	var STORE_KEY;
	var TRASH = 'TRASH';

	var selectedTask$;
	var tips$ = $('.validateTips');
	var storeKeys$ = $('#store-keys');

	function loadData() {
		categories = (amplify.store(STORE_KEY) || {});
		categories[TRASH] = []; // empty out the trash
		amplify.store(STORE_KEY, categories);
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
		amplify.store(STORE_KEY, categories);
	}

	function appendList(list, task) {
		list.append('<li><div class="box"><div class="handle">&nbsp;</div>&nbsp;<pre class="editable">{0}</pre></div></li>'.format(task));
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

		if (STORE_KEY !== 'MTC Time Reporting') {
			keys.sort();
		}

		$table.find('td.removable').remove();
		$table.find('th.removable').remove();
		for (i = 0; i < keys.length; i++) {
			$table.append(createColumn(keys[i], categories[keys[i]]));
		}
	}

	function updateTips(t) {
		tips$.text(t).addClass('ui-state-highlight').show();
		setTimeout(function() {
			tips$.removeClass('ui-state-highlight', 1500);
		}, 500);
	}

	function checkExistingStore(o, key) {
		var result = true;
		var obj = amplify.store(key);
		if (obj) {
			o.addClass('ui-state-error').focus();
			updateTips('"{0}" already exists.'.format(key));
			result = false;
		}
		return result;
	}

	function checkExistingCategory(o, key) {
		var result = true;
		if ($('#' + key).length > 0) {
			o.addClass('ui-state-error').focus();
			updateTips('"{0}" already exists.'.format(key));
			result = false;
		}
		return result;
	}

	function checkLength(o, n, min, max) {
		var result = true;
		if (o.val().length > max || o.val().length < min) {
			o.addClass('ui-state-error').focus();
			updateTips('{0} must be between {1} and {2} characters.'.format(n, min, max));
			result = false;
		}
		return result;
	}

//	function checkRegexp(o, regexp, n) {
//		var result = true;
//		if (!(regexp.test(o.val()))) {
//			o.addClass('ui-state-error');
//			updateTips(n);
//			result = false;
//		}
//		return result;
//	}

	function bindSortables() {
		$('.sortable').sortable({
			handle: '.handle',
			connectWith: '.connectedSortable',
			stop: function() { // drag is done
				saveCategories();
			}
		}).disableSelection();
	}

	function initialize(storeKey) {
		if (storeKey) {
			STORE_KEY = storeKey;
		}
		loadData();
		createBoard();
		bindSortables();
		$('#json-data').empty();
		$('#json-button').text("Show JSON data");
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
	}).on('click', '.editable', function() {
		selectedTask$ = $(this);
		$('#edit-task-desc').val(selectedTask$.text());
		$('#dialog-edit-task').dialog('open');
	});

	$('#dialog-create-store').dialog({
		autoOpen: false,
		width: 350,
		height: 250,
		modal: true,
		buttons: {
			'Create store': function() {
				var bValid = true, key, storeName = $('#store-name');
				allFields = $([]).add(storeName);
				allFields.removeClass('ui-state-error');
				key = storeName.val().replace(' ', '');
				bValid = bValid && checkLength(storeName, 'Name', 3, 16);
				bValid = bValid && checkExistingStore(storeName, key, 'Name');
				if (bValid) {
					categories = {};
					amplify.store(key, categories);
					initializeStores(key);
					$(this).dialog('close');
				}
				allFields = null;
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			tips$.hide();
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	$('#dialog-delete-store').dialog({
		autoOpen: false,
		width: 350,
		height: 150,
		modal: true,
		buttons: {
			'Delete store': function() {
				amplify.store(STORE_KEY, null);
				initializeStores();
				$(this).dialog('close');
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		}
	});

	$('#dialog-create-category').dialog({
		autoOpen: false,
		width: 350,
		height: 250,
		modal: true,
		buttons: {
			'Create category': function() {
				var bValid = true, key, categoryName = $('#category-name');
				allFields = $([]).add(categoryName);
				allFields.removeClass('ui-state-error');
				key = categoryName.val().replace(' ', '');
				bValid = bValid && checkLength(categoryName, 'Name', 3, 16);
				bValid = bValid && checkExistingCategory(categoryName, key, 'Name');
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
		close: function() {
			tips$.hide();
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
				var bValid = true, taskDesc = $('#new-task-desc');
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
			tips$.hide();
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
				var bValid = true, taskDesc = $('#edit-task-desc');
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
			tips$.hide();
			selectedTask$ = null;
			if (allFields) {
				allFields.val('').removeClass('ui-state-error');
			}
		}
	});

	$('#json-button').click(function() {
		var _SHOW = "Show JSON data";
		var _HIDE = "Hide JSON data";
		if ($(this).text() === _SHOW) {
			$('#json-data').text(JSON.stringify(categories)).removeClass('hidden');
			$(this).text(_HIDE);
		} else {
			$('#json-data').empty();
			$(this).text(_SHOW);
		}
	}).removeClass('hidden');

	$('#store-add').click(function() {
		$('#dialog-create-store').dialog('open');
	});

	$('#store-remove').click(function() {
		$('#dialog-delete-store').dialog('open');
	});

	function initializeStores(storeKey) {
		storeKeys$.find('option').remove(); // delete existing select options

		$.each(amplify.store(), function(key, value) {
			if (storeKey && storeKey === key) {
				storeKeys$.append($('<option selected="selected"></option>').attr('value', key).text(key)); 
			} else {
				storeKeys$.append($('<option></option>').attr('value', key).text(key)); 
			}
		});

		if (storeKey) {
			STORE_KEY = storeKey;
		} else {
			STORE_KEY = storeKeys$.val();
		}

		storeKeys$.unbind('change').change(function() {
			initialize($(this).val());
		});
	}

	function restoreData() {
		// delete any existing stores
		$.each(amplify.store(), function(key, value) {
			amplify.store(key, null);
			console.log('deleted ' + key);
		});
		// use static content saved from "Show JSON data"
		amplify.store('Personal', {"ANAM":{"name":"ANAM","tasks":["Gift shop","Design with new logo"]},"BrownBag":{"name":"BrownBag","tasks":["Brown bag session on Ember.js JavaScript MVC framework and Handlebars templating library","Advanced","Nested templates (partials)","www.lukemelia.com for ideas"]},"Todo":{"name":"Todo","tasks":["Cancelled TrueVoice - confirmation # ms15432721201305081944","Cancelled ZenFolio (sent cancel email from vivie_joseph@hotmail.com) will not renew after 9/10/13","Point Blue Parrot Imaging to new site under Island 'ting"]},"WebDev":{"name":"WebDev","tasks":["Change KanBan to use AmplifyJS and ability to add and remove stores (DONE)"]}});
		amplify.store('511Traffic', {"AWS":{"name":"AWS","tasks":["Amazon deployment instructions in \"My Documents\\_AWS\""]}});
		amplify.store('EDFS', {"EventUI":{"name":"Event UI","tasks":["Incident - no need to override 30 min interval (so no alarm UI)","A scheduled event (construction or sporting event) (then need UI)"]},"Logging":{"name":"Logging","tasks":["Verify that all errors are trapped and reported (UC) added ajax and window.onerror handling (DONE)"]},"Research":{"name":"Research","tasks":["CodeProject - Log Reporting Dashboard for ASP.NET MVC","CodeProject - JSNLog - JavaScript logging integrated with ASP.NET and MVC","jsplumb state machine demo"]},"Services":{"name":"Services","tasks":["Active/Passive service activation (DONE)","Unit testing of multiple LogProcessor instances (DONE)","Unit testing of single timer based service instance (DONE)","Unit testing of multiple timer based service instances (DONE)"]},"TODO":{"name":"TODO","tasks":["Session Ping (DONE)\nIntegrate into refresh (TBD)","Notify other users when item is being edited (UC see EditedEvents?ids=1501,1504)"]},"Website":{"name":"Website","tasks":["Use unobtrusive ajax for content refresh (DONE)","Refresh and column sorting on UserAccounts (DONE)","EDFS Schedule schema (DONE)","Move start and end date info from EDFSEvent to Schedule (DONE)","Add/Edit Event details"]}});
		amplify.store('Login', {"API":{"name":"API","tasks":["82d0d010-7660-40d0-bbc0-0a4b331df793"]},"BugTracker":{"name":"BugTracker","tasks":["dbalmer / Saic1234"]},"SVN":{"name":"SVN","tasks":["dbalmer / Saic1234"]},"Staging":{"name":"Staging","tasks":["Staging VPN: 54.215.176.133\ndbalmer / Saic1234\n","UTILS-STG Server for builds: 10.60.81.12\ndbalmer@mtc511 / Saic1234\n"]}});
		amplify.store('Hosting', {"AAA":{"name":"AAA","tasks":["FInd out what domains are hosted on ANAM and DBALMER"]},"ANAM":{"name":"ANAM","tasks":["Sync with GitHub","Copy files to IslandTing","Export database","Point domains to IslandTing"]},"ANAMDONE":{"name":"ANAM DONE","tasks":[]},"BRIANMLOW":{"name":"BRIANMLOW","tasks":[]},"BRIANMLOWDONE":{"name":"BRIANMLOW DONE","tasks":[]},"DBALMER":{"name":"DBALMER","tasks":[]},"DBALMERDONE":{"name":"DBALMER DONE","tasks":[]}});
	}

	//restoreData();
	initializeStores('Hosting');
	initialize();
});