const data = require('./data.js');

const fetchFn = require('./fetch.js');
const saveData = require('./saveData.js');
const config = require('../../public/kribrum/json/config.json');
const edite = require('./edite.js');
const classes = require('./classes.js');

let timer = 3000, step = 0, speed = 1, interval;
const events = {
	stopVisualMap: function() {
		step = 0;
		events.playVisualMap(false);
		$('#palyPayse').removeClass('play');
		classes.getPaintRegion();
	},
	speedVisualMap: function() {
		speed++;
		if(speed > 5) {
			speed = 1;
		}
		events.resizeSpeed();
		return speed
	},
	resizeSpeed: function() {
		events.playVisualMap(false);
		events.playVisualMap(true);
	},
	playVisualMap: function(status) {
		let maxStep = data.getDatesList().length;
		if(status) {
			$('.highcharts-axis-labels span').eq(step).addClass('active').siblings().removeClass('active');
			classes.getPaintRegionDay(data.getDatesList()[step]);
			interval = setTimeout(function() {
				step++
				if(step == maxStep) {
					step = 0;
				}
				events.playVisualMap(true);
			}, (timer / speed))
		} else {
			$('.highcharts-axis-labels span').removeClass('active');
			clearTimeout(interval)
		}
	},
	find: function() {
		$( ".find-region input" ).autocomplete({
			source: function (request, response) {
	            response($.map(data.getDataServer(), function (obj, key) {
					var name = obj.name.toUpperCase();
					
					if (name.indexOf(request.term.toUpperCase()) != -1) {				
						return {
							label: obj.name,
							value: obj.name,
							rid: obj.rid
						}
					} else {
						return null;
					}
				}));	
		    },
			minLength: 2,
			change: function( event, ui ) {
				// data.setRidData([]);
			},
			search: function( event, ui ) {
				// console.log(ui);
			},
			response: function( event, ui ) {		
				let res = [];
				ui.content.map((item) => {
					res.push(parseInt(item.rid));
				})
				data.setRidData(res);	
			},
			select: function( event, ui ) {
				data.setRidData([parseInt(ui.item.rid)]);
				edite.buildListRegion();
				// edite.editGrafickChartLineTensions();
			}
		});
	},
	loadProjectData: function() {
		fetchFn.loadProjectData().then(res => {
			if(res.success) {
				data.setProjectsData(res);
				edite.editeBlockMode('by_the_number_of_messages', 'cancel', false, null);
				edite.editeBlockMode('general_conclusions', 'cancel', false, null);
				edite.editeBlockMode('by_the_level_of_audience_engagement', 'cancel', false, null);
				edite.legendTensions('cancel');
				classes.preloader(false, 'Готово');
				edite.editListCoutry();
			} else {
				localStorage.removeItem('userKlibrum');
				location.href=location.href;
			}
		});
		saveData.getSave().newObj = {};
		saveData.getSave().editObj = {};
		saveData.getSave().deletedObj = {};

		$('.panel.left-panel .items .item .edit-options').removeClass('edit-mode-use');
	},
	closeAlldataTabs: function() {
		$('.panel.left-panel .items .item').removeClass('open');
		$('.panel.right-panel .items .item').removeClass('open');
		$('.panel .items .item .edit-options').removeClass('edit-mode-use');
	},
	openAlldataTabs: function() {
		$('.panel.left-panel .items .item').addClass('open');
		$('.panel.right-panel .items .item').addClass('open');
		$('.panel .items .item .edit-options').removeClass('edit-mode-use');
	}
}

module.exports = events;