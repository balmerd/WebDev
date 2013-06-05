$(function() {
	var tasks;
	var columnNum = 1;
	var TRASH = 'TRASH';
	var STORE_KEY = 'timesheet';
	var store = Lawnchair( {adapter: 'dom'}, $.noop);

	store.get(STORE_KEY, function(obj) {
		if (obj) { // get saved content
			tasks = obj.value;
		} else { // revert to static content (captured from "Show JSON data" button)
			tasks = {
				"OPT": [
				],
				"OandM": [
				],
				"Parking": [
				],
				"IRAD": [
				],
				"DCOL2": [
					"4hrs"
				],
				"Migration": [
				]
			};
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
		state_column.append($('<div class="headline{0}">{1}</div>'.format((stateName === TRASH ? '' : ' clickable'), stateName.replace('_', ' ').replace('and', '&'))));
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
				append_list($('ul#' + name.replace('&', 'and')), task);
				save_tasks();
			}
		}
	});

	$('button').click(function() {
		var _SHOW = "Show JSON data"
		var _HIDE = "Hide JSON data";
		if ($(this).text() === _SHOW) {
			store.get(STORE_KEY, function(obj) {
				if (obj) { // get saved content
					$('#json-data').text(JSON.stringify(obj.value)).removeClass('hidden');
				} else {
					$('#json-data').text('no data').removeClass('hidden');
				}
			});
			$(this).text(_HIDE);
		} else {
			$('#json-data').empty();
			$(this).text(_SHOW);
		}
	}).removeClass('hidden');
});