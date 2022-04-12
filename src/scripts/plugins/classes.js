const config = require('../../public/kribrum/json/config.json');
const data = require('./data.js');

let valueSlider = [0, 100];
let highlightedFeatures = null, layer;
const classes = {
	setIndexes: function() {
		var activeProject;
		data.getProjects().map((item, ind) => {
			if(data.getDataUser.getProject() == item.pid) {
				activeProject = ind
			}
		})
		let arrIndex = (new Function("return " + data.getProjects()[activeProject].indexes+ ";")());
		config.gradientData.map((item, ind) => {
			if(ind < arrIndex.length-1) {
				item.min_max = [arrIndex[ind], arrIndex[ind+1]];
			} else {
				item.min_max = [arrIndex[ind], 100];
			}
		})
	},
	inputValid: function(elem, parent) {
		if (classes.inputFilter(elem.value)) {
	        elem.oldValue = elem.value;
	        elem.oldSelectionStart = elem.selectionStart;
	        elem.oldSelectionEnd = elem.selectionEnd;
		} else if (elem.hasOwnProperty("oldValue")) {
			elem.value = elem.oldValue;
			elem.setSelectionRange(elem.oldSelectionStart, elem.oldSelectionEnd);
		} else {
			elem.value = "";
		}
	},
	inputFilter: function(value) {
		return /^-?\d*[.]?\d{0,1}$/.test(value);
	},
	inputIndexes: function(elem, parent) {
		var sv = elem.dataset.sv;
		var minmax = elem.dataset.tp;
		var spl = sv.split('-');
		var res = elem.value;
		parent.querySelector('.'+sv).value = res;
		if(sv == 'ind-2-1' || sv == 'ind-3-0') {
			parent.querySelector('.ind-3-0').value = '>'+res
		}
		arrValue = [];
		for(var i=0; i<4; i++) {
			val = parent.querySelector('.'+spl[0]+'-'+i+'-'+'0').value;
			if(i==3) {
				val = val.split('>')[1];
			}
			arrValue.push(Number(val))
		}
		ifValid = true;
		arrValue.map((item, ind) => {
			if(arrValue[ind-1] >= item || isNaN(arrValue[ind])) {
				ifValid = false
			}
		})
		// console.log(arrValue);
		data.setLegendRes([ifValid, arrValue]);
	},
	getWeekYear: function() {
		let ts,
	       newYear,
	       newYearDay,
	       wNum;
	    ts = (data.getDates()[1]) ? new Date(data.getDates()[1]) : new Date();
	    newYear = new Date(ts.getFullYear(), 0, 1);
	    newYearDay = newYear.getDay()-1;
	    wNum = Math.floor(((ts.getTime() - newYear.getTime())/1000/60/60/24 + newYearDay)/7);
	    return wNum;
	},
	getYear: function() {
		currentdate = new Date();
		return currentdate.getFullYear();
	},
	getIndexTensions: function(obj) {
		let summMessTypeResult = 0;
		let numberMessageDay = [];
		let topauthorsrating = [];
		let authorsbymessage = [];
		let repostDay = [];
 
		let platformList = data.getPeriodInfoData().messages_by_source;

		config.ridRegion.indexOf(obj.rid) != -1 ? num = 100 : num = 1000;
		let summMessage = [];
		// console.log(obj);
		obj.data.map((item, ind) => {
			if(data.getDatesList().indexOf(item.dt) != -1) {
				// console.log(item);
				// console.log(item);
				summMessType = parseInt(item.bad) + parseInt(item.good) + parseInt(item.neutral);

				summMessage.push({date: item.dt, sumMess: summMessType});
				dt = new Date(item.dt);

				nMD = {
					"dt": [config.dayName[dt.getDay()], getDayMonthDate(dt)],
					"dt2": item.dt,
					"value": parseInt(summMessType)
				}
				numberMessageDay.push(nMD)

				topauthorsrating.push(item.authors_by_rating);
				authorsbymessage.push(item.authors_by_message);
				item.platforms.map((platform) => {
					let isTrue = false;
					for(i=0; i<=data.getPeriodInfoData().messages_by_source.length-1; i++) {
						if (data.getPeriodInfoData().messages_by_source[i].platform_id == platform.platform_id) {
							isTrue = true;
							data.getPeriodInfoData().messages_by_source[i].total += parseInt(platform.total);
						}
					}
					isTrue ? '' : data.getPeriodInfoData().messages_by_source.push({
											platform_id: platform.platform_id,
											total: parseInt(platform.total)
										})
				})
				if(obj.type == 'country') {
					let dt = false;
					data.getSocialStat().reposts.map((itm) => {
						if(itm.dt == item.dt) {
							itm.reposts += parseInt(item.reposts)
							dt = true;
						}
					})
					if(dt == false) {
						data.getSocialStat().reposts.push({dt: item.dt, reposts: parseInt(item.reposts)});
						dt = false;
					}

					data.getSocialStat().likes.map((itm) => {
						if(itm.dt == item.dt) {
							itm.likes += parseInt(item.likes)
							dt = true;
						}
					})
					if(dt == false) {
						data.getSocialStat().likes.push({dt: item.dt, likes: parseInt(item.likes)});
						dt = false;
					}

					data.getSocialStat().comments.map((itm) => {
						if(itm.dt == item.dt) {
							itm.comments += parseInt(item.comments)
							dt = true;
						}
					})
					if(dt == false) {
						data.getSocialStat().comments.push({dt: item.dt, comments: parseInt(item.comments)});
						dt = false;
					}

					data.getSocialStat().views.map((itm) => {
						if(itm.dt == item.dt) {
							itm.views += (parseInt(item.comments) + parseInt(item.likes) + parseInt(item.reposts))
							dt = true;
						}
					})
					if(dt == false) {
						data.getSocialStat().views.push({dt: item.dt, views: (parseInt(item.comments) + parseInt(item.likes) + parseInt(item.reposts))});
						dt = false;
					}
				}
			} else {
			}
		})
		let prop = ((num / 7) * 7);
		let arrResult = [], allMessage = 0;
		for(let z=0; z<=summMessage.length-1; z++) {
			allMessage += summMessage[z].sumMess;
			tensionDay = (summMessage[z].sumMess / parseInt(obj.population) * prop)*7;
			if(isNaN(tensionDay) || tensionDay == Infinity) {
				tensionDay = 0;
			} else {
				tensionDay = Math.round(tensionDay*100)/100;
			}
			arrResult.push({date: summMessage[z].date, tension: tensionDay, color: classes.gradientColor(classes.indexTensionToProcent(tensionDay))});
		}
		var arrResSumm = 0;
		for (var i = 0; i < arrResult.length; i++) {
			arrResSumm += arrResult[i].tension
		}
		result = arrResSumm / summMessage.length
		if(isNaN(result) || result == Infinity) {
			result = 0;
		} else {
			result = Math.round(result*100)/100;
		}

		data.getPeriodInfoData().total_messages = data.getPeriodInfoData().total_messages + allMessage;

		var numberMessageDayValues = numberMessageDay.map(function ( key ) { return key.value; });
		res = {
			"rid": obj.rid,
			"tension": result,
			"color": classes.gradientColor(classes.indexTensionToProcent(result)),
			"procent": classes.indexTensionToProcent(result),
			"number_of_messages_by_day": numberMessageDay,
			"number_of_messages_by_day_max": Math.max.apply( null, numberMessageDayValues ),
			"top_5_authors_by_rating": topauthorsrating,
			"top_5_authors_by_number_of_posts": authorsbymessage,
			"most_talked_about_events": [],
			"tensionDays": arrResult
		}
		return res;
	},
	summMessageDayRegion: function(objRegion) {

		return objRegion;
	},
	indexTensionToProcent: function(val) {
		if(val >= config.gradientData[0].min_max[0] && val < config.gradientData[0].min_max[1]) {
			val = config.gradientData[0].procent_gradient[1] - (((config.gradientData[0].procent_gradient[1] - config.gradientData[0].procent_gradient[0]) * (config.gradientData[0].min_max[1]- val)) / (config.gradientData[0].min_max[1] - config.gradientData[0].min_max[0]))
		} else if(val >= config.gradientData[1].min_max[0] && val < config.gradientData[1].min_max[1]) {
			val = config.gradientData[1].procent_gradient[1] - (((config.gradientData[1].procent_gradient[1] - config.gradientData[1].procent_gradient[0]) * (config.gradientData[1].min_max[1]- val)) / (config.gradientData[1].min_max[1] - config.gradientData[1].min_max[0]))
		} else if(val >= config.gradientData[2].min_max[0] && val < config.gradientData[2].min_max[1]) {
			val = config.gradientData[2].procent_gradient[1] - (((config.gradientData[2].procent_gradient[1] - config.gradientData[2].procent_gradient[0]) * (config.gradientData[2].min_max[1]- val)) / (config.gradientData[2].min_max[1] - config.gradientData[2].min_max[0]))
		} else if(val >= config.gradientData[3].min_max[0]) {
			// console.log(val);
			val = config.gradientData[3].procent_gradient[1] - (((config.gradientData[3].procent_gradient[1] - config.gradientData[3].procent_gradient[0]) * (config.gradientData[3].min_max[1]- val)) / (config.gradientData[3].min_max[1] - config.gradientData[3].min_max[0]))
			// console.log(val);
			// val = 100;
		}
		if(val > 100) {
			val = 100;
		}
		val = 100 - val;
		if(val < 1) {
			val = 1;
		}
		return val;
	},
	getPaintRegion: function() {
		matchExpressio = ['match', ['get', 'rid']]
		matchExpressionCountry = matchExpressio;
		matchExpressionRegion = matchExpressio;
		matchExpressionCity = matchExpressio;
		data.getRegionInfoDate().map((item) => {
			dayColor = item.color;
			$('#'+item.rid+' .information-country .index', '.items-country').css('background-color', 'rgb('+dayColor+')');
			$('#'+item.rid+' .information-country .index', '.items-country').html(item.tension);
			if(item.procent >= valueSlider[0] && item.procent <= valueSlider[1]) {
				switch (item.type) {
					case 'country':
						matchExpressionCountry.push(item.rid, 'rgb('+item.color+')');
						break;
					case 'region':
						matchExpressionRegion.push(item.rid, 'rgb('+item.color+')');
						break;
					case 'city':
						matchExpressionCity.push(item.rid, 'rgb('+item.color+')');
						break;
					default:

						break;
				}
			}
		})
		matchExpressionCountry.push('#ffffff');
		matchExpressionRegion.push('#ffffff');
		matchExpressionCity.push('#ffffff');
		global.foo.setPaintProperty("a0-fill", "fill-color", matchExpressionCountry);
		global.foo.setPaintProperty("a1-fill", "fill-color", matchExpressionRegion);
		global.foo.setPaintProperty("a2-fill", "fill-color", matchExpressionCity);
	},
	gradientColor: function(val) {
		var colorRange = []
		$.each(config.gradient, function( index, value ) {
		    if(val<=value[0]) {
		        colorRange = [index-1,index]
		        return false;
		    }
		});
		var firstcolor = config.gradient[colorRange[0]][1];
		var secondcolor = config.gradient[colorRange[1]][1];

		var firstcolor_x = (config.gradient[colorRange[0]][0]/100);
		var secondcolor_x = (config.gradient[colorRange[1]][0]/100)-firstcolor_x;
		var slider_x = (val/100)-firstcolor_x;
		var ratio = slider_x/secondcolor_x;

		var result = classes.pickHex( secondcolor,firstcolor, ratio );
		return result;
	},
	getPaintRegionDay: function(day) {
		matchExpressio = ['match', ['get', 'rid']]
		matchExpressionCountry = matchExpressio;
		matchExpressionRegion = matchExpressio;
		matchExpressionCity = matchExpressio;
		data.getRegionInfoDate().map((item) => {
			for(i=0;i<=item.tensionDays.length-1;i++) {
				if(item.tensionDays[i].date != undefined) {
					if(item.tensionDays[i].date == day) {
						dayColor = item.tensionDays[i].color;
						$('#item-'+item.rid+' .information-country .index', '.items-country').css('background-color', 'rgb('+dayColor+')')
						$('#item-'+item.rid+' .information-country .index', '.items-country').html(item.tensionDays[i].tension)
					}
				}
			}
			if(item.procent >= valueSlider[0] && item.procent <= valueSlider[1]) {
				switch (item.type) {
					case 'country':
						matchExpressionCountry.push(item.rid, 'rgb('+dayColor+')');
						break;
					case 'region':
						matchExpressionRegion.push(item.rid, 'rgb('+dayColor+')');
						break;
					case 'city':
						matchExpressionCity.push(item.rid, 'rgb('+dayColor+')');
						break;
					default:

						break;
				}
			}
		})
		matchExpressionCountry.push('#ffffff');
		matchExpressionRegion.push('#ffffff');
		matchExpressionCity.push('#ffffff');
		global.foo.setPaintProperty("a0-fill", "fill-color", matchExpressionCountry);
		global.foo.setPaintProperty("a1-fill", "fill-color", matchExpressionRegion);
		global.foo.setPaintProperty("a2-fill", "fill-color", matchExpressionCity);
	},
	getActiveRegion: function(id) {
		matchExpressio = ['in', 'rid']
		matchExpressionCountry = matchExpressio;
		matchExpressionRegion = matchExpressio;
		matchExpressionCity = matchExpressio;
		// console.log(data.getGradienData());
		data.getRegionInfoDate().map((item) => {
			if(item.rid == id) {
				switch (item.type) {
					case 'country':
						matchExpressionCountry.push(item.rid);
						break;
					case 'region':
						matchExpressionRegion.push(item.rid);
						break;
					case 'city':
						matchExpressionCity.push(item.rid);
						break;
					default:

						break;
				}
			}
		})
		global.foo.setFilter('a0-select', matchExpressionCountry);
		global.foo.setFilter('a1-select', matchExpressionRegion);
		global.foo.setFilter('a2-select', matchExpressionCity);
	},
	getFilterSlider: function(value) {
		valueSlider = value;
		matchExpressio = ['match', ['get', 'rid']]
		matchExpressionCountry = matchExpressio;
		matchExpressionRegion = matchExpressio;
		matchExpressionCity = matchExpressio;
		data.getRegionInfoDate().map((item) => {
			if(item.procent >= value[0] && item.procent <= value[1]) {
				switch (item.type) {
					case 'country':
						matchExpressionCountry.push(item.rid, 'rgb('+item.color+')');
						break;
					case 'region':
						matchExpressionRegion.push(item.rid, 'rgb('+item.color+')');
						break;
					case 'city':
						matchExpressionCity.push(item.rid, 'rgb('+item.color+')');
						break;
					default:

						break;
				}
			}
		})
		matchExpressionCountry.push('#ffffff');
		matchExpressionRegion.push('#ffffff');
		matchExpressionCity.push('#ffffff');
		global.foo.setPaintProperty("a0-fill", "fill-color", matchExpressionCountry);
		global.foo.setPaintProperty("a1-fill", "fill-color", matchExpressionRegion);
		global.foo.setPaintProperty("a2-fill", "fill-color", matchExpressionCity);
	},
	pickHex: function(color1, color2, weight) {
	    var p = weight;
	    var w = p * 2 - 1;
	    var w1 = (w/1+1) / 2;
	    var w2 = 1 - w1;
	    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
	        Math.round(color1[1] * w1 + color2[1] * w2),
	        Math.round(color1[2] * w1 + color2[2] * w2)];
	    return rgb;
	},
	getAuthData: function(option) {
		if(option) {
			$('#authorization').addClass('hidden');
			document.getElementById('username').innerHTML = data.getUserInfo().name;
			document.getElementById('usernameacc').innerHTML = data.getUserInfo().name;
			document.getElementById('typeuser').innerHTML = data.getUserInfo().type;
		} else {
			classes.preloader(false);
			$('#authorization').removeClass('hidden');
		}
	},
	preloader: function(option, status) {
		if(status != undefined) {
			document.getElementById('preloader').querySelector('span').innerHTML = status;
		}
		if(option) {
			$('html').addClass('preload');
		} else {
			$('html').removeClass('preload');
		}
	},
	preloadRegion: function(status) {
		if(status) {
			document.querySelector('.items-country').classList.add('load');
		} else {
			document.querySelector('.items-country').classList.remove('load');
			document.querySelectorAll('.block-statistik').forEach(function(item) {
				item.scrollTop = 0;
			})
		}
	},
	errors: function(error, type) {
		// console.log(error, type);
		switch (error.msg) {
			case 'not auth':
				if(type == 'data') {
					classes.getAuthData(false)
				} else {
					alert('Сессия устарела')
					location.href=location.href;
				}
				break;
			case 'no description':
				console.log('Warn!:: Не заполнено поле "Описание", сохранение не удалось');
				break;
			case 'no region':
				console.log('Warn!:: Не заполнено поле "Регион", сохранение не удалось');
				break;
			case 'no amount':
				console.log('Warn!:: Не заполнено поле "Колличество", сохранение не удалось');
				break;
			case 'no_user_found':
				console.log('Warn!:: Не верный логин или пароль');
				alert('Не верный логин или пароль')
				break;
			default:
				throw new Error(error.msg);
				break;
		}
	},
	widthScroll: function() {
		let div = document.querySelector('#block-scroll');
		let scrollWidth = div.offsetWidth - div.clientWidth;
		let padding = 16;
		if(scrollWidth > 0) {
			document.querySelector('html').classList.add('scroll-windows');
			padding = 0;
		}
		document.querySelector('.scrollWidth.right-panel').style.paddingLeft = padding+scrollWidth+'px';
		document.querySelector('.right-panel .scrollWidth').style.paddingLeft = padding+'px';
		document.querySelector('.left-panel.scrollWidth').style.paddingRight = padding+scrollWidth+'px';
		document.querySelector('.left-panel .scrollWidth').style.paddingRight = padding+'px';
	}
}
function getDayMonthDate(date) {
	return ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2);
}
function getYearMonthDayDate(date) {
	return  date.getFullYear() + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + ('0' + date.getDate()).slice(-2);
}

module.exports = classes;