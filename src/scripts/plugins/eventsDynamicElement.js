const data = require('./data.js');
const events = require('./events.js');
const edite = require('./edite.js');
const loadContent = require('./loader.js');
const charts = require('./charts.js');
const config = require('../../public/kribrum/json/config.json');
const classes = require('./classes.js');
const datepicker = require('./datepicker.js');
const getData = require('./fetch.js');

const eventsDynamic = {
	initAllEvents: function() {
		$('#palyPayse').on('click', function(event) {
			$(this).toggleClass('play');
			if($(this).hasClass('play')) {
				events.playVisualMap(true);
			} else {
				events.stopVisualMap();
			}
		})
		$('#speed').on('click', function(event) {
			$(this).toggleClass('play');
			$('span', this).html('x'+events.speedVisualMap())
		})
		$('.input-radio input').on('change', function(event) {
			$('#app').css('font-size', this.value+'px');
			charts.resizeTensionChart();
			charts.resizeTensionChartLine();
		});
		$('#exit-app').on('click', function(event) {
			localStorage.removeItem('userKlibrum');
			location.href=location.href;
		});
		$('.expand .title, .expand .btn-eapand').on('click', function(event) {
			$(this).parents('.expand').toggleClass('open');
		});
		$('#button-setup').on('click', function(event) {
			$('html').toggleClass('setup-menu-open');
		});
		$('#sort-tension').on('click', function(event) {
			$(this).addClass('active').siblings('#sort-name').removeClass('active');
			(edite.regionSortByTension()) ? $(this).addClass('is-sort') : $(this).removeClass('is-sort');
			eventsDynamic.updateDataSort();
		});
		$('#sort-name').on('click', function(event) {
			$(this).addClass('active').siblings('#sort-tension').removeClass('active');
			(edite.regionSortByName()) ? $(this).addClass('is-sort') : $(this).removeClass('is-sort');
			eventsDynamic.updateDataSort();
		});
		$('#filter-region').on('click', function(event) {
			$(this).toggleClass('open');
		});
		$(document).mouseup(function (e){
			var div = $(".filter-type");
			if (!div.is(e.target)
			    && div.has(e.target).length === 0) {
				$('#filter-region').removeClass('open')
			}
		});
		
		$('#filter-region .filter-type input').on('change', function() {
			checkedItm = [];
			$('#filter-region .filter-type input').each(function(itm) {
				if(this.checked) {
					checkedItm.push(this.dataset.filter)
				}
			})
			data.setFilter(checkedItm);
			eventsDynamic.updateDataSort();
			// console.log(data.getFilter());
		}) 
		$('button.today').on('click', function(event) {
			data.setDates([data.getDatesServer()[1], data.getDatesServer()[1]]);
			// console.log(data.getDates());
			datepicker.updateDates();
			data.setPeriodInfoData(JSON.parse(JSON.stringify(config.periodInfoData)));
			eventsDynamic.updateDateApp();
			$('.filter-data button').removeClass('active');
			$('.filter-data button.today').addClass('active');
		});
		$('button.week').on('click', function(event) {
			data.setDates([data.getDatesServer()[0], data.getDatesServer()[1]]);
			datepicker.updateDates();
			data.setPeriodInfoData(JSON.parse(JSON.stringify(config.periodInfoData)));
			eventsDynamic.updateDateApp();
			$('.filter-data button').removeClass('active');
			$('.filter-data button.week').addClass('active');
		});
		$('button.submit').on('click', function(event) {
			// console.log(data.getDates());
			data.setPeriodInfoData(JSON.parse(JSON.stringify(config.periodInfoData)));
			eventsDynamic.updateDateApp();
			$('.filter-data button').removeClass('active');
		});
		$('button.submit-search').on('click', function(event) {
			event.preventDefault();
			if($('.find-region input')[0].value == "") {
				data.setRidData([]);
			}
			edite.buildListRegion();
		});
		$('.hidden-panel-right').on('click', function(event) {
			$('html').toggleClass('hidden-right-panel');
			charts.resizeTensionChart();
		});
		$('.hidden-panel-left').on('click', function(event) {
			$('html').toggleClass('hidden-left-panel');
			charts.resizeTensionChart();
		});
		$('.hidden-all').on('click', function(event) {
			$(this).toggleClass('active');
			if($(this).hasClass('active')) {
				$('html').addClass('hidden-right-panel hidden-left-panel hidden-header');
				$('html').removeClass('visible-history setup-menu-open');
			} else {
				$('html').removeClass('hidden-right-panel hidden-left-panel hidden-header');
			}
			charts.resizeTensionChart();
		});
		$('.hidden-slider').on('click', function(event) {
			$('html').toggleClass('hidden-slider');
			charts.resizeTensionChart();
		});
		$('.visible-hidden-history').on('click', function(event) {
			$('html').toggleClass('visible-history');
		});
		$('.hidden-data').on('click', function(event) {
			if($(this).hasClass('hidden-all')) {
				$(this).removeClass('hidden-all');
				events.openAlldataTabs();
				data.setHiddenPanel(false);
			} else {
				$(this).addClass('hidden-all');
				events.closeAlldataTabs();
				data.setHiddenPanel(true);
			}
		});
		$('#zoomin').on('click', function(event) {
			global.foo.zoomIn({duration: 1000});
		});
		$('#zoomout').on('click', function(event) {
			global.foo.zoomOut({duration: 1000});
		});
		$('#signin').on('click', function(event) {
			event.preventDefault();
			// login = $('#login').val();
			login = document.getElementById('login').value;
			// password = $('#password').val();
			password = document.getElementById('password').value;
			loadContent.loginUser(login, password);
		})
	},
	updateDataSort: function() {
		classes.preloadRegion(true);
		setTimeout(function() {
			edite.buildListRegion()
		}, 10)
	},
	updateDateApp: async function() {
		classes.preloadRegion(true);
		getData.loadDataServerDays().then(res => {
			if(res.success) {
				data.setDataServer([]);
				data.setDataServer(res.regions);
				// console.log(data.getDates());

				edite.editListCoutry();
				edite.generalInformationOutput();
				edite.editGrafickChartLineTensions();
				events.stopVisualMap();
				events.loadProjectData();
			} else {
				alert('Сессия устарела');
				localStorage.removeItem('userKlibrum');
				location.href=location.href;
			}
		})
	}
}

module.exports = eventsDynamic;