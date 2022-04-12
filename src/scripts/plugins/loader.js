const data = require('./data.js');
const getData = require('./fetch.js');
const classes = require('./classes.js');
const customSelect = require('./customSelect.js');
const mapbox = require('./mapbox.js');

// const customSelect = require('./customSelect.js');
// const findRegion = require('./findRegion.js');
const sliders = require('./slider.js');
const datepicker = require('./datepicker.js');
const events = require('./events.js');

const loadContent = {
	initSession: function() {
		// localStorage.removeItem('userKlibrum');
		(data.getDataUser.getKey() == null) ? classes.getAuthData(false) : loadContent.loadServerData();
	},
	loginUser: function(login, password) {
		getData.authorization(login, password).then(res => {
			if(res) {
				data.setDataUser.setKey(res.user.a_key);
				data.setDatesServer([res.dates[0].dt, res.dates[res.dates.length-1].dt]);
				loadContent.loadServerData();
			} else {
				classes.getAuthData(false);
			}
		})
	},
	loadServerData: function() {
		data.setDatesServer([data.intF1(new Date(), 7), data.intF1(new Date(), 1)]);
		getData.loadDataServer(data.getDatesServer()).then(res => {
			// console.log(res);
			if(!res.success) {
				classes.getAuthData(false);
				return
			}
			data.setDatesServer([]);
			data.setDataServer(res.regions);
			data.setUserInfo(res.user)
			getData.getUserProjects().then(res => {
				// console.log(res);
				data.setProjects(res.projects);
				customSelect.buildSelectProjects();
				loadContent.loadsPlugins();

				classes.preloader(true, 'Загружаю данные по проекту');
				getData.loadProjectData().then(res => {
					data.setProjectsData(res)
				})
				// classes.getAuthData(true);
				// classes.preloader(false, 'Готово');
			})
		})
	},
	loadsPlugins: function() {
		classes.setIndexes();
		mapbox.initMap();
		sliders.sliderGradient();
		events.find();
		classes.widthScroll();
		// edite.getProjects();
	}
}

module.exports = loadContent;