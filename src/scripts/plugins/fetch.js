const config = require('../../public/kribrum/json/config.json');
const data = require('./data.js');
const classes = require('./classes.js');

const fetchFn = {
	authorization: async function(login, password) {
		classes.preloader(true, 'Выполняется вход');
		let response = await fetch(config.SERVER_URL+'/api/login?login='+login+'&password='+password).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	loadDataServer: async function(dates) {
		classes.preloader(true, 'Загружаю данные');
		let response = await fetch(config.SERVER_URL+'/api/getDataByDates?date_from='+data.getDatesServer()[0]+'&date_to='+data.getDatesServer()[1]+'&a_key='+data.getDataUser.getKey()).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			return response 
		}
	},
	loadDataServerDays: async function(dates) {
		classes.preloader(true, 'Загружаю данные');
		let response = await fetch(config.SERVER_URL+'/api/getDataByDates?date_from='+data.getDates()[0]+'&date_to='+data.getDates()[1]+'&a_key='+data.getDataUser.getKey()).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			return response 
		}
	},
	getUserProjects: async function() {
		classes.preloader(true, 'Загружаю проект');
		let response = await fetch(config.SERVER_URL+'/api/getUsersProjects?&a_key='+data.getDataUser.getKey()).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return response;
		}
	},
	loadProjectData: async function() {
		let response = await fetch(config.SERVER_URL+'/api/getProjectData?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&week='+classes.getWeekYear()+'&year='+classes.getYear()).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	getProjectRegionData: async function(rid) {
		let response = await fetch(config.SERVER_URL+'/api/getProjectRegionData?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&rid='+rid+'&week='+classes.getWeekYear()+'&year='+classes.getYear()).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	saveProjectRegionEvent: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		(obj.id == null) ? id = '' : id = '&id='+obj.id
		let response = await fetch(config.SERVER_URL+'/api/saveProjectRegionEvent?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&rid='+obj.rid+'&week='+classes.getWeekYear()+'&year='+classes.getYear()+'&description='+obj.description+id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	deleteProjectRegionEvent: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		let response = await fetch(config.SERVER_URL+'/api/deleteProjectRegionEvent?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&rid='+obj.rid+'&id='+obj.id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	saveProjectConclusion: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		(obj.id == null) ? id = '' : id = '&id='+obj.id
		let response = await fetch(config.SERVER_URL+'/api/saveProjectConclusion?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&week='+classes.getWeekYear()+'&year='+classes.getYear()+'&description='+obj.description+id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	deleteProjectConclusion: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		let response = await fetch(config.SERVER_URL+'/api/deleteProjectConclusion?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&id='+obj.id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	saveProjectTopProtest: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		(obj.id == null) ? id = '' : id = '&id='+obj.id;
		let response = await fetch(config.SERVER_URL+'/api/saveProjectTopProtest?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&week='+classes.getWeekYear()+'&year='+classes.getYear()+'&description='+obj.description+'&amount='+obj.amount+'&region='+obj.region+'&by='+obj.by+id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	deleteProjectTopProtest: async function(obj) {
		classes.preloader(true, 'Сохраняю');
		let response = await fetch(config.SERVER_URL+'/api/deleteProjectTopProtest?&a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&by='+obj.by+'&id='+obj.id).then(response => response.json())
		if(response.success) {
			return response 
		} else {
			classes.errors(response);
			return false;
		}
	},
	saveProjectIndexes: async function(indexes) {
		classes.preloader(true, 'Сохраняю');
		let response = await fetch(config.SERVER_URL+'/api/saveProjectIndexes?a_key='+data.getDataUser.getKey()+'&pid='+data.getDataUser.getProject()+'&indexes=['+indexes+']').then(response => response.json())
		if(response.success) {
			return response
		} else {
			classes.errors(response);
			return false;
		}
	}
}

module.exports = fetchFn;

