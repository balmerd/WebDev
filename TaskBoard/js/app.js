$(function() {
	var tasks;
	var columnNum = 1;
	var TRASH = 'TRASH';
	var STORE_KEY = 'kanban';
	var store = Lawnchair( {adapter: 'dom'}, $.noop);

	store.get(STORE_KEY, function(obj) {
		if (obj) { // get saved content
			tasks = obj.value;
		} else { // revert to static content (captured from "show JSON data" button)
			tasks = {"Queue":["OPT 1195 - When an icon is clicked, the HOV lane is also drawn on the map and the map zooms to the lane boundaries.","Admin CMS - convert hash tags containing & to &amp; to prevent server-side errors","Modify default OpenLayers popup style","Support Primary/Secondary connection strings per DB in config. Try each until one works. BRANCH ALL PROJECTS FIRST."],"Research":["OPT 1399 - Add toll bridge info to Traffic Map","Amazon deployment instructions in \"My Documents\\_AWS\""],"Design":["O&M 1400 - need map and toolbar icons for Park & Ride Lots"],"Develop":[],"Document":["Brown bag session on Ember.js JavaScript MVC framework and Handlebars templating library","Include Handlebars helpers","Include nested templates (partials)"],"Test":[],"Release_Ready":["Read config and survey xml path from registry. Move Traffic config xml into separate Config folder.","Add stack trace to StaticMaps logging","Add content-expiration header to site master pages. Add cachebuster to static map images.","Get Shields from AWS","Should not be tracking HOV_LANES during traffic refresh","Only track ZOOM and MAGNIFY once per session","Truncate TrafficLand tables if feed outdated","O&M 1400 - Add P&R lots to Traffic map","O&M 1415 - Provide error message on Traffic page when Caltrans CMS feed is down","OPT 1416 - Develop CMS text page for 511 Traffic and TIC use"],"Released":["Update WebMonitor to look at tblWatchDog for \"CMSSigns\"","Test plan for manual testing of traffic website","Show bounds of traffic feature click","Show bounds of selected traffic features","Add disclamer to TrafficLand camera dialog"],"Complete":["Investigate AWS deployment strategies"]};
		};
		tasks[TRASH] = []; // empty out the trash
		store.save({ key: STORE_KEY, value: tasks });
	});

	var append_list = function(list, task) {
		list.append('<li><div class="box"><div class="handle">:-)</div>&nbsp;<span class="editable">{0}</span></div></li>'.format(task));
	};

	var create_list = function(col, stateName, state) {
		var list = $('<ul id="{0}" class="sortable connectedSortable col{1}"></ul>'.format(stateName, col));
		$.each(state, function(taskIndex, task) {
			append_list(list, task);
		});
		return list;
	};

	var create_column = function(stateName, state) {
		var state_column = $('<div class="column"></div>');
		state_column.append($('<div class="headline{0}">{1}</div>'.format((stateName === TRASH ? '' : ' clickable'), stateName.replace('_', ' '))));
		state_column.append(create_list(columnNum++, stateName, state));
		return state_column;
	};

	var save_tasks = function() {
		tasks = {};
		$('.column ul').each(function() {
			var id = $(this).attr('id');
			tasks[id] = [];
			$(this).find('.editable').each(function() {
				tasks[id].push($(this).text());
			});
		});
		store.save({ key: STORE_KEY, value: tasks });
	};

	var create_board = function() {
		var state, ids = [];
		var table = $('<div id="board"></div>');
		for (stateName in tasks) {
			if (tasks.hasOwnProperty(stateName)) {
				ids.push('#' + stateName);
				table.append(create_column(stateName, tasks[stateName]));
			}
		}
		return table;
	};

	var board$ = create_board();

	$("#output").html(board$);

	$('.sortable').sortable({
		handle: '.handle',
		connectWith: '.connectedSortable',
		stop: function(evt, ui) { // drag is done
			save_tasks();
		}
	}).disableSelection();

	board$.on('click', '.editable', function() {
		var task = $(this).text();
		task = prompt('Update task description', task);
		if (task && task !== "") {
			$(this).text(task);
			save_tasks();
		}
	});

	$('.headline').click(function() {
		var name = $(this).text().replace(' ', '_');
		if (name !== TRASH) {
			var task = prompt('Enter task description');
			if (task && task !== "") {
				append_list($('ul#' + name), task);
				save_tasks();
			}
		}
	});

	$('button').click(function() {
		var _SHOW = "Show JSON data"
		var _CLEAR = "Clear JSON data";
		if ($(this).text() === _SHOW) {
			store.get(STORE_KEY, function(obj) {
				if (obj) { // get saved content
					$('#json-data').text(JSON.stringify(obj.value)).removeClass('hidden');
				} else {
					$('#json-data').text('no data').removeClass('hidden');
				}
			});
			$(this).text(_CLEAR);
		} else {
			$('#json-data').empty();
			$(this).text(_SHOW);
		}
	}).removeClass('hidden');
});