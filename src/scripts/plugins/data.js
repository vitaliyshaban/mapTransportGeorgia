const config = require('../../public/kribrum/json/config.json');

let dadaRegions = [];
let allMapJson = [];
let gradientData = [];
let datesServer = [];
let hiddenAllPanel = null;
let dates = [];
let datesAllList = [];
let ridData = config.ridView;
let regionInfoDate = [];
let periodInfoData = JSON.parse(JSON.stringify(config.periodInfoData));
let userInfo = {};
// let typeUser = "operator";
let projects = [];
let projectsData = [];
let iSsort = [null, true];
let filterRegion = ['country','region','city'];
let socialStat = {
	reposts: [],
	likes: [],
	comments: [],
	views: []
}
let legendResult = [];

const data = {
	getLegendRes: function() {
		return legendResult;
	},
	setLegendRes: function(data) {
		legendResult = data;
	},
	setDatesServer: function(date) {
		if(!date.length) {
			data.setDates(datesServer);
		}
		datesServer = date;
	},
	getDatesServer: function() {
		return datesServer
	},
	setDates: function(data) {
		dates = data;
	},
	getDates: function() {
		return dates;
	},
	getDatesList: function() {
		return data.getDaysArray(new Date(data.getDates()[0]), new Date(data.getDates()[1]));
	},
	setDatesAllList: function(data) {
		datesAllList = data;
	},
	getDatesAllList: function() {
		return datesAllList;
	},
	getDataServer: function() {
		return dadaRegions
	},
	setDataServer: function(data) {
		dadaRegions = data;
	},
	getMapJson: function() {
		return allMapJson
	},
	setMapJson: function(data) {
		allMapJson = data;
	},
	setGradienData: function(data) {
		gradientData = data;
	},
	getGradienData: function(data) {
		return gradientData;
	},
	setRidData: function(data) {
		ridData = data;
	},
	getRidData: function() {
		return ridData;
	},
	setRegionInfoDate: function(data) {
		regionInfoDate = data;
	},
	getRegionInfoDate: function(data) {
		return regionInfoDate;
	},
	setPeriodInfoData: function(data) {
		periodInfoData = data;
	},
	getPeriodInfoData: function(data) {
		return periodInfoData;
	},
	setDataUser: {
		setKey: function(key) {
			localStorage.setItem('userKlibrum', JSON.stringify({"key": key}));
		},
		setProject: function(proj) {
			let obj =  {
				key: JSON.parse(localStorage.getItem('userKlibrum')).key,
				project: proj
			}
			localStorage.setItem('userKlibrum', JSON.stringify(obj));
		}
	},
	getDataUser: {
		getKey: function() {
			if(localStorage.getItem('userKlibrum') != null) {
				if(localStorage.getItem('userKlibrum').split(':').length > 1) {
					storage = JSON.parse(localStorage.getItem('userKlibrum')).key;
				} else {
					storage = null;
				}
			} else {
				storage = null;
			}
			return storage;
		},
		getProject: function() {
			storage = JSON.parse(localStorage.getItem('userKlibrum')).project;
			return storage;
		}
	},
	setUserInfo: function(data) {
		userInfo = data;
	},
	getUserInfo: function() {
		return userInfo;
	},
	setProjects: function(data) {
		projects = data;
	},
	getProjects: function() {
		return projects;
	},
	setProjectsData: function(data) {
		projectsData = data;
	},
	getProjectsData: function() {
		return projectsData;
	},
	setSort: function(data) {
		iSsort = data;
	},
	getSort: function() {
		return iSsort;
	},
	setFilter: function(data) {
		filterRegion = data;
	},
	getFilter: function() {
		return filterRegion;
	},
	setSocialStat: function(data) {
		socialStat = data;
	},
	getSocialStat: function() {
		return socialStat;
	},
	setHiddenPanel: function(data) {
		hiddenAllPanel = data;
	},
	getHiddenPanel: function() {
		return hiddenAllPanel;
	},
	intF1: function(date, day) {
		date.setFullYear(date.getFullYear() + 0, date.getMonth() + 0, date.getDate() - day);
		return data.getFormatDate(date);
	},
	getFormatDate: function(date) {
		return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
	},
	getDaysArray: function(start, end) {
	    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
	        arr.push(data.getFormatDate(dt));
	    }
	    return arr;
	}
}


module.exports = data;