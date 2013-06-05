$(function() {
	var tasks;
	var columnNum = 1;
	var TRASH = 'TRASH';
	var STORE_KEY = 'kanban';
	var store = Lawnchair( {adapter: 'dom'}, $.noop);

	store.get(STORE_KEY, function(obj) {
		if (obj) { // get saved content
			tasks = obj.value;
		} else { // revert to static content (captured from "Show JSON data" button)
			tasks = {"Queue":["Admin CMS - convert hash tags containing & to amp to prevent server-side errors","Modify default OpenLayers popup style"],"511Traffic":["TRAFFIC WEB BRANCH - merge changes from My Documents: _511Traffic\\todo.txt","511 Traffic Map Zooming Issue on Chrome (CANNOT REPRODUCE)"],"IRAD":["My511 Personalization using AWS DynamoDB (get AWS .NET toolkit)"],"IRAD_Mobile":["HTML5/CSS3 with map, incidents and speed lines","Use FireFox Tools/Developer/Responsive Design View"],"DCOL2":["CHARGE TO Data Collection SubSystem","DataObjects and add DataUtils.Helper for serialization. Added NUnit serialization test cases (DONE)","Finish XML serialization, verify against docs (DONE)","Link data object : store last 5 LinkConditions (DONE)","Abstract configuration (DONE)"],"Migration":["BRANCH ALL PROJECTS FIRST (DONE)","Support multiple connection strings per DB in config. Try each until one works. (DONE)","CCNet to S3 (works - copy zip files to C:\\Projects\\Traffic 2.0 - Deployment\\ExportToS3 folder then run C:\\Projects\\AWS_Publish\\AWS_Publish.exe)","EC2 bootstrap download from S3 (WORKING)","CHARGE TO 182737.05.2.CY13.52. 00.00.000","ec2traffic.511.org at 54.241.132.205","Let Giedrius know when we need to have My511 available on AWS","CMS Signs (DONE)","Toll Bridges (DONE)","TrafficLand Cameras (DONE)","HOV Lanes (DONE 25 rows from XLS)","Deploy 511Traffic Web Branch (TBD)"],"Document":["Brown bag session on Ember.js JavaScript MVC framework and Handlebars templating library","Advanced","Nested templates (partials)","Amazon deployment instructions in \"My Documents\\_AWS\"","www.lukemelia.com for ideas"],"Release_Ready":["Add stack trace to StaticMaps logging","Add content-expiration header to site master pages. Add cachebuster to static map images.","Get Shields from AWS","Should not be tracking HOV_LANES during traffic refresh","Only track ZOOM and MAGNIFY once per session","Truncate TrafficLand tables if feed outdated","Only baseMapTile STANDARD from AWS (DONE to trafficweb4)","During cdt if zoom in/out brings back incidents"],"Complete":["Update WebMonitor to look at tblWatchDog for \"CMSSigns\"","Test plan for manual testing of traffic website","Show bounds of selected traffic features","Add disclamer to TrafficLand camera dialog","Show bounds of traffic feature click"],"TRASH":[]};
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