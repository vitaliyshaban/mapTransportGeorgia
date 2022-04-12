const config = require('../../public/kribrum/json/config.json');
const templates = require('./templates.js');
const getData = require('./fetch.js');
const charts = require('./charts.js');
const data = require('./data.js');
const events = require('./events.js');
const classes = require('./classes.js');
const saveData = require('./saveData.js');
const turf = require('@turf/turf');
const boundsData = require('../../public/kribrum/json/data/bounds.json');
const findRegion = require('./findRegion.js');


const edite = {
	editeBlockMode: function(id, mode, bool, rid, indexEl) {
		if(bool) {
			optionsType = findIdRegion(id.split('-')[0]);
			regionId = id.split('-')[1];
		} else {
			optionsType = findId(id);
		}
		if(optionsType.disabled) {
			return false
		}
		type = optionsType.type;
		switch (type) {
			case 'list':
				let ul = document.createElement('ul');
				blockList = document.querySelector('#'+id+' .content-block.list');
				blockList.innerHTML = '';
				data.getProjectsData().conclusions.map((item, ind) => {
					let li = document.createElement('li');
					switch (mode) {
						case 'edit':
							li.innerHTML = templates.editList(optionsType, optionsType.options.permission.deleted[data.getUserInfo().type]);
							ul.classList.add('textarea_edit');
							li.dataset.id = item.id;
							li.querySelector(optionsType.type_edit.tag).innerHTML = item.description;
							li.querySelector('textarea').oninput = function() {
								if(saveData.getSave().editObj[id] == undefined) {
									saveData.getSave().editObj[id] = {};
								}
								if(saveData.getSave().editObj[id][this.parentNode.dataset.id] == undefined) {
									let editeObj = {
										description: '',
										id: item.id
									}
									saveData.getSave().editObj[id][this.parentNode.dataset.id] = editeObj;
								}
								saveData.getSave().editObj[id][this.parentNode.dataset.id].description = this.value;
							}

							li.querySelector('.deleted').addEventListener('click', function() {
								delObj = {
									id: this.parentNode.dataset.id,
									rid: rid
								}
								if(saveData.getSave().deletedObj[id] == undefined) {
									saveData.getSave().deletedObj[id] = {};
								}
								objLenght = Object.keys(saveData.getSave().deletedObj[id]).length-1;
								objIndex = Object.keys(saveData.getSave().deletedObj[id])[objLenght];
								(objIndex == undefined) ? objIndex = 0 : objIndex++
								saveData.getSave().deletedObj[id][objIndex] = delObj;
								this.parentNode.remove();
							})
							ul.appendChild(li);
							break;
						case 'save':
							li.innerHTML = item.description;
							ul.appendChild(li);
							break;
						default:
							li.innerHTML = item.description;
							ul.appendChild(li);
							break;
					}
					
				})
				let divNoelementList = document.createElement('div');
					divNoelementList.classList.add('no-events');
					divNoelementList.innerHTML = '<span>Нет общих выводов</span>';
					blockList.append(ul, divNoelementList);

				if (data.getProjectsData().conclusions.length) {
					// blockInfo.append(ulReg);
					blockList.querySelector('.no-events').style.display = 'none';
				} else {
					blockList.querySelector('.no-events').style.display = 'block';
				}

				if(optionsType.options.permission.addField[data.getUserInfo().type] && mode == 'edit') {
					let button = document.createElement('button');
						button.innerHTML = optionsType.options.permission.addField.value;
						button.addEventListener('click', function() {
							let saveObj = {
								description: '',
								id: null
							}

							if(saveData.getSave().newObj[id] == undefined) {
								saveData.getSave().newObj[id] = {};
							}
							objLenght = Object.keys(saveData.getSave().newObj[id]).length-1;
							objIndex = Object.keys(saveData.getSave().newObj[id])[objLenght];
							(objIndex == undefined) ? objIndex = 0 : objIndex++
							saveData.getSave().newObj[id][objIndex] = saveObj;

							blockList.querySelector('.no-events').style.display = 'none';
							let li = document.createElement('li');
							li.innerHTML = templates.editList(optionsType, optionsType.options.permission.deleted[data.getUserInfo().type]);
							li.dataset.addIndex = objIndex;


							li.querySelector('.deleted').addEventListener('click', function() {
								delete saveData.getSave().newObj[id][this.parentNode.dataset.addIndex];
								this.parentNode.remove();
							})
							li.querySelector('textarea').oninput = function() {
								saveData.getSave().newObj[id][this.parentNode.dataset.addIndex].description = this.value;
							}
							blockList.querySelector('ul').classList.add('textarea_edit');
							blockList.querySelector('ul').append(li);
						})
						blockList.append(button)
				}
				
				break;
			case 'list-region':
				let ulReg = document.createElement('ul');
				let blockInfo = document.querySelector('#item-'+rid+' .content-block.list-region');
				if(blockInfo != null) {
					blockInfo.innerHTML = '';
					edite.findIndexRegion(rid)[optionsType.id].map((item, ind) => {
						let li = document.createElement('li');
						let isSort = document.querySelector('#item-'+rid+' .filter').classList.contains('is-sort');
						switch (mode) {
							case 'edit':
								li.innerHTML = templates.editList(optionsType, optionsType.options.permission.deleted[data.getUserInfo().type]);
								li.dataset.id = item.id;
								ulReg.classList.add('textarea_edit');
								li.querySelector(optionsType.type_edit.tag).innerHTML = item.description;

								li.querySelector('textarea').oninput = function() {
									if(saveData.getSave().editObj[id] == undefined) {
										saveData.getSave().editObj[id] = {};
									}
									if(saveData.getSave().editObj[id][this.parentNode.dataset.id] == undefined) {
										let editeObj = {
											rid: rid,
											description: '',
											id: item.id
										}
										saveData.getSave().editObj[id][this.parentNode.dataset.id] = editeObj;
									}
									saveData.getSave().editObj[id][this.parentNode.dataset.id].description = this.value;
								}

								li.querySelector('.deleted').addEventListener('click', function() {
									delObj = {
										id: this.parentNode.dataset.id,
										rid: rid
									}
									if(saveData.getSave().deletedObj[id] == undefined) {
										saveData.getSave().deletedObj[id] = {};
									}
									objLenght = Object.keys(saveData.getSave().deletedObj[id]).length-1;
									objIndex = Object.keys(saveData.getSave().deletedObj[id])[objLenght];
									(objIndex == undefined) ? objIndex = 0 : objIndex++
									saveData.getSave().deletedObj[id][objIndex] = delObj;
									this.parentNode.remove();
								})

								if(isSort) {
									ulReg.prepend(li);
								} else {
									ulReg.appendChild(li);
								}
								break;
							case 'save':
								li.innerHTML = item.description;
								if(isSort) {
									ulReg.prepend(li);
								} else {
									ulReg.appendChild(li);
								}
								break;
							default:
								li.innerHTML = item.description;
								if(isSort) {
									ulReg.prepend(li);
								} else {
									ulReg.appendChild(li);
								}
								break;
						}
						
					})

					let divNoelement = document.createElement('div');
						divNoelement.classList.add('no-events');
						divNoelement.innerHTML = '<span>Нет событий</span>';
					blockInfo.append(divNoelement,ulReg);
					if (edite.findIndexRegion(rid)[optionsType.id].length) {
						blockInfo.querySelector('.no-events').style.display = 'none';
					} else {
						blockInfo.querySelector('.no-events').style.display = 'block';
					}
					if(optionsType.options.permission.addField[data.getUserInfo().type] && mode == 'edit') {
						let button = document.createElement('button');
							button.innerHTML = optionsType.options.permission.addField.value;
							button.addEventListener('click', function() {
								let saveObj = {
									rid: rid,
									description: '',
									id: null
								}

								if(saveData.getSave().newObj[id] == undefined) {
									saveData.getSave().newObj[id] = {};
								}
								objLenght = Object.keys(saveData.getSave().newObj[id]).length-1;
								objIndex = Object.keys(saveData.getSave().newObj[id])[objLenght];
								(objIndex == undefined) ? objIndex = 0 : objIndex++
								saveData.getSave().newObj[id][objIndex] = saveObj;

								blockInfo.querySelector('.no-events').style.display = 'none';
								let li = document.createElement('li');
								li.innerHTML = templates.editList(optionsType, optionsType.options.permission.deleted[data.getUserInfo().type]);
								li.dataset.addIndex = objIndex;


								li.querySelector('.deleted').addEventListener('click', function() {
									delete saveData.getSave().newObj[id][this.parentNode.dataset.addIndex];
									this.parentNode.remove();
								})
								li.querySelector('textarea').oninput = function() {
									saveData.getSave().newObj[id][this.parentNode.dataset.addIndex].description = this.value;
								}
								blockInfo.querySelector('ul').classList.add('textarea_edit');
								blockInfo.querySelector('ul').append(li);
							})
						blockInfo.append(button)
					}
				}
				break;
			case 'table':
				let div = document.createElement('div');

					div.classList.add('table-block')
					div.innerHTML = "<table></table>";
					let blockTable = document.querySelector('#'+id+' .content-block.table');
					// console.log(id);
					blockTable.innerHTML = '';
					// console.log(id);
					let am, nameBlock;
					if(id == 'by_the_number_of_messages'){
						am = 'm';
						nameBlock = 'данных';
					} else {
						am = 'a'
						nameBlock = 'данных';
					}
					data.getProjectsData()['protests_by_'+am].map((item, ind) => {
						let tr = document.createElement('tr');
						switch (mode) {
							case 'edit':
								if(optionsType.options.permission.deleted[data.getUserInfo().type]) {
									deletedIco = '<i class="deleted">'+require('../../public/kribrum/images/icons/panel/ico-deleted.svg')+'</i>';
								}
								div.classList.add("textarea_edit");
								td = '<td><textarea data-edit="amount" rows="'+optionsType.type_edit.rows+'">'+item.amount+'</textarea></td><td><textarea class="fRegion" data-edit="region" rows="'+optionsType.type_edit.rows+'">'+item.region+'</textarea></td><td><textarea data-edit="description" rows="'+optionsType.type_edit.rows+'">'+item.description+'</textarea></td><td>'+deletedIco+'</td>'
								tr.innerHTML  = td;
								tr.dataset.id = item.id;

								tr.querySelectorAll('textarea').forEach(function(text) {
									text.onchange = function() {
										if(saveData.getSave().editObj[id] == undefined) {
											saveData.getSave().editObj[id] = {};
										}
										if(saveData.getSave().editObj[id][this.parentNode.parentNode.dataset.id] == undefined) {
											let editeObj = {
												amount: item.amount,
												description: item.description,
												region: item.region,
												by: am,
												id: item.id
											}
											saveData.getSave().editObj[id][this.parentNode.parentNode.dataset.id] = editeObj;
										}
										saveData.getSave().editObj[id][this.parentNode.parentNode.dataset.id][this.dataset.edit] = this.value;
										// console.log(saveData.getSave().editObj);
									}
								})
								findRegion.findReg(tr.querySelector('.fRegion'));

								tr.querySelector('.deleted').addEventListener('click', function() {
									delObj = {
										by: am,
										id: item.id
									}
									if(saveData.getSave().deletedObj[id] == undefined) {
										saveData.getSave().deletedObj[id] = {};
									}
									objLenght = Object.keys(saveData.getSave().deletedObj[id]).length-1;
									objIndex = Object.keys(saveData.getSave().deletedObj[id])[objLenght];
									(objIndex == undefined) ? objIndex = 0 : objIndex++
									saveData.getSave().deletedObj[id][objIndex] = delObj;
									this.parentNode.parentNode.remove();
								})

								if(optionsType.isFilter) {
									div.querySelector('table').prepend(tr);
								} else {
									div.querySelector('table').appendChild(tr);
								}
								break;
							case 'save':
								td = '<td>'+item.amount+'</td><td>'+item.region+'</td><td>'+item.description+'</td>'
								tr.innerHTML = td;
								if(optionsType.isFilter) {
									div.querySelector('table').prepend(tr);
								} else {
									div.querySelector('table').appendChild(tr);
								}
								break;
							default:
								td = '<td>'+item.amount+'</td><td>'+item.region+'</td><td>'+item.description+'</td>'
								tr.innerHTML  = td;
								if(optionsType.isFilter) {
									div.querySelector('table').prepend(tr);
								} else {
									div.querySelector('table').appendChild(tr);
								}
								break;
						}
					})
					let divNo = document.createElement('div');
						divNo.classList.add('no-events');
						divNo.innerHTML = '<span>Нет '+nameBlock+'</span>';
						blockTable.append(divNo,div);
					if (data.getProjectsData()['protests_by_'+am].length) {
						blockTable.querySelector('.no-events').style.display = 'none';
					} else {
						blockTable.querySelector('.no-events').style.display = 'block';
					}
				if(optionsType.options.permission.addField[data.getUserInfo().type] && mode == 'edit') {
					let button = document.createElement('button');
						button.innerHTML = optionsType.options.permission.addField.value;
						button.addEventListener('click', function() {
							let saveObj = {
								amount: '',
								description: '',
								region: '',
								by: am,
								id: null
							}

							if(saveData.getSave().newObj[id] == undefined) {
								saveData.getSave().newObj[id] = {};
							}
							objLenght = Object.keys(saveData.getSave().newObj[id]).length-1;
							objIndex = Object.keys(saveData.getSave().newObj[id])[objLenght];
							var addInd = 0;
							if(blockTable.querySelectorAll('table tr').length) {
								// console.log(blockTable.querySelectorAll('table tr')[blockTable.querySelectorAll('table tr').length-1].dataset.id);
								addInd = parseInt(blockTable.querySelectorAll('table tr')[blockTable.querySelectorAll('table tr').length-1].dataset.id) + 1;
							}
							(objIndex == undefined) ? objIndex = addInd : objIndex++;
							saveObj.amount = objIndex+1;
							saveObj.description = '-';
							saveData.getSave().newObj[id][objIndex] = saveObj;
							if(optionsType.options.permission.deleted[data.getUserInfo().type]) {
								deletedIco = '<i class="deleted">'+require('../../public/kribrum/images/icons/panel/ico-deleted.svg')+'</i>';
							}
							blockTable.querySelector('.no-events').style.display = 'none';
							let tr = document.createElement('tr');
								td = '<td><textarea data-edit="amount" rows="'+optionsType.type_edit.rows+'">'+saveObj.amount+'</textarea></td><td><textarea class="fRegion" data-edit="region" rows="'+optionsType.type_edit.rows+'"></textarea></td><td><textarea data-edit="description" rows="'+optionsType.type_edit.rows+'">'+saveObj.description+'</textarea></td><td>'+deletedIco+'</td>'
								tr.innerHTML  = td;
								tr.dataset.addIndex = objIndex;

							tr.querySelector('.deleted').addEventListener('click', function() {
								delete saveData.getSave().newObj[id][this.parentNode.parentNode.dataset.addIndex];
								this.parentNode.parentNode.remove();
							})
							tr.querySelectorAll('textarea').forEach(function(text) {
								text.onchange = function() {
									saveData.getSave().newObj[id][this.parentNode.parentNode.dataset.addIndex][this.dataset.edit] = this.value;
									// console.log(saveData.getSave().newObj);
								}
							})
							findRegion.findReg(tr.querySelector('.fRegion'));
							blockTable.querySelector('.table-block').classList.add('textarea_edit');
							blockTable.querySelector('table').appendChild(tr);
						})
					blockTable.append(button)
				}
				break;
			case 'table-head':
					let tableHead = document.querySelector('#'+optionsType.id+'-'+rid+' .content-block.table-head');
					tableHead.innerHTML = '';
					(indexEl) ? indexEl : indexEl = 0;
					let isSort = document.querySelector('#'+optionsType.id+'-'+rid+' .filter').classList.contains('is-sort');
					let th = null;
					let divTbl = null;

					edite.findIndexRegion(rid)[optionsType.id][indexEl].map((item, ind) => {
						if(ind == 0) {
							divTbl = document.createElement('div');
							divTbl.classList.add('table-block')
							divTbl.innerHTML = "<table></table>";
							th = document.createElement('tr');
							th.innerHTML = "<th>"+optionsType.tableHead[0]+"</th><th>"+optionsType.tableHead[1]+"</th><th>"+optionsType.tableHead[2]+"</th>";
							}
						let tr = document.createElement('tr');

						isUrl(item.name) ? name = '<a target="_blank" href="'+item.name+'">ссылка</a>' : name = item.name
						isUrl(item.profile) ? isLink = '<a target="_blank" href="'+item.profile+'">'+item.login+'</a>' : isLink = item.login
						isUrl(item.platform) ? platform = '<a target="_blank" href="'+item.platform+'">ссылка</a>' : platform = item.platform
						isUrl(item.login) ? isLink = '<a target="_blank" href="'+item.login+'">ссылка</a>' : isLink = item.login
						switch (mode) {
							case 'edit':
								divTbl.classList.add("textarea_edit");
								td = '<td><textarea rows="'+optionsType.type_edit.rows+'">'+item.name+'</textarea></td><td><textarea rows="'+optionsType.type_edit.rows+'">'+item.login+'</textarea></td><td><textarea rows="'+optionsType.type_edit.rows+'">'+item.platform+'</textarea></td>'
								tr.innerHTML  = td;
								if(isSort) {
									divTbl.querySelector('table').prepend(tr);
								} else {
									divTbl.querySelector('table').appendChild(tr);
								}
								break;
							case 'save':
								td = '<td>'+name+'</td><td>'+isLink+'</td><td>'+platform+'</td>'
								tr.innerHTML  = td;
								if(isSort) {
									divTbl.querySelector('table').prepend(tr);
								} else {
									divTbl.querySelector('table').appendChild(tr);
								}
								break;
							default:
								td = '<td>'+name+'</td><td>'+isLink+'</td><td>'+platform+'</td>'
								tr.innerHTML  = td;
								if(isSort) {
									divTbl.querySelector('table').prepend(tr);
								} else {
									divTbl.querySelector('table').appendChild(tr);
								}
								break;
						}
					})
					if(divTbl != null) {
						divTbl.querySelector('table').prepend(th);
						tableHead.append(divTbl);
					} else {
						tableHead.innerHTML = '<div class="no-events"><span>Нет данных</span></div>';
					}
				break;
			case 'grafick':
				let divGr = document.createElement('div');
					divGr.classList.add('items-grafick');
					let grafickBlock = document.querySelector('#'+id+' .content-block.grafick');
					grafickBlock.innerHTML = '';
					data.getPeriodInfoData().[optionsType.id].sort(function(a, b){
					    return b.total - a.total;
					});
					let maxValue = '';
					let listMassga = null;
					data.getPeriodInfoData().[optionsType.id].map((item, ind) => {
						maxValue == '' ? maxValue = item.total : ''
						listMassga = ind;
						icon = '/public/kribrum/images/icons/social/no_ico.png';
						if(config.icoSocial.indexOf(item.platform_id) != -1) {
							icon = '/public/kribrum/images/icons/social/'+item.platform_id+'.png';
						}
						if(ind < 8) {
							divGr.innerHTML += 	'<div class="item-grafick">'+
													'<div class="ico">'+
														'<img src="'+icon+'">'+
													'</div>'+
													'<div class="gr">'+
														'<div class="name">'+item.platform_id+'</div>'+
														'<div class="graf-data">'+
															'<span style="width: '+(item.total*100)/maxValue+'%">'+
																'<i>'+item.total+'</i>'+
															'</span>'+
														'</div>'+
													'</div>'+
												'</div>'
						}
					})
					if(listMassga != null) {
						grafickBlock.append(divGr);
					} else {
						grafickBlock.innerHTML = '<div class="no-events"><span>Нет данных</span></div>'
					}
				break;
			case 'grafick-message':
				let divGrMess = document.createElement('div');
					divGrMess.classList.add('items-grafick');
					let grafMess = document.querySelector('#'+optionsType.id+'-'+rid+' .content-block.grafick-message');
					grafMess.innerHTML = '';
					maxValueGraf = edite.findIndexRegion(rid)[optionsType.id+'_max'];
					edite.findIndexRegion(rid)[optionsType.id].map((item, ind) => {
						let isActive = '';
						if(ind == 0) {
							isActive = 'active';
						}
						divGrMess.innerHTML += 	'<div class="item-grafick '+isActive+'">'+
													'<div class="date-bl">'+
														'<div class="day">'+item.dt[0]+'</div>'+
														'<div class="date">'+item.dt[1]+'</div>'+
													'</div>'+
													'<div class="graf">'+
														'<span style="width: '+(item.value*100)/maxValueGraf+'%"></span>'+
														'<div class="num">'+
															'<span>'+item.value+'</span>'+
														'</div>'+
													'</div>'+
												'</div>';
					})
					divGrMess.querySelectorAll('.item-grafick').forEach((elem) => {
						elem.addEventListener('click', (e) => {
							indexEl = getElIndex(elem);
							idEl = elem.parentNode.parentNode.parentNode.id.split('-')[1];
							edite.editeBlockMode('top_5_authors_by_rating-'+idEl, 'table-head', true, rid, indexEl);
							edite.editeBlockMode('top_5_authors_by_number_of_posts-'+idEl, 'table-head', true, rid, indexEl);
							getSiblings(elem).forEach((el) => {
								el.classList.remove('active');
							})
							elem.classList.add('active');
						});
					})
					grafMess.append(divGrMess);
				break;
			case 'grafick-chart-line':
				let grafickChartBlock = document.querySelector('#'+id+' .content-block.'+optionsType.type);
				grafickChartBlock.innerHTML = '';
				if(document.querySelector('#'+optionsType.id+'-chart') == null) {
					let divChart = document.createElement('div');
						divChart.id = optionsType.id+'-chart';
						divChart.classList.add('chart-line');
						grafickChartBlock.append(divChart);
				}
				let summ = 0;
				let obS = [{
					name: optionsType.id,
					data: []
				}]
				data.getSocialStat()[optionsType.id].map((item, ind) => {
					summ += item[optionsType.id];
					obS[0].data.push(item[optionsType.id]);
				})
				document.querySelector('#'+id+' .num').innerHTML = summ;
				charts.chartLine(optionsType.id, obS);
				break;
			case 'numb':
				document.querySelector('#'+id+' .num').innerHTML = data.getPeriodInfoData()[optionsType.id];
				break;
			default:
				// statements_def
				break;
		}
	},
	legendTensions: function(mode) {
		// mode = 'edit'
		let legendBlock = document.querySelector('#legend .legend ul');
		legendBlock.innerHTML = '';
		let lenLegend = config.gradientData.length-1
		config.gradientData.map((item, ind) => {
			switch (mode) {
				case 'edit':
					let newLiedit = document.createElement('li');
						newLiedit.classList.add('edit-mode');
						var disable = '';
						var mn = 'ind-'+(ind-1)+'-1'
						var mx = 'ind-'+(ind+1)+'-0'
						if(ind == 0) {
							disable = 'disabled';
							mn = '';
						}
						var minInput = '<input data-sv="'+mn+'" data-tp="min" class="index-edite ind-'+ind+'-0" '+disable+' type="text" value="'+item.min_max[0]+'">';
						var maxInput = '-<input data-sv="'+mx+'" data-tp="max" class="index-edite ind-'+ind+'-1" type="text" value="'+item.min_max[1]+'">';
						if(ind == lenLegend) {
							minInput = '<input data-sv="'+mn+'" data-tp="min" class="index-edite  ind-'+ind+'-0 max" type="text" value=">'+item.min_max[0]+'">';
							maxInput = '';
						}
						newLiedit.innerHTML = '<i style="background-color: rgb('+item.color+')"></i> <b>'+item.name+'</b> <span>'+minInput+maxInput+'</span>';
						newLiedit.querySelectorAll('.index-edite').forEach(function(elem) {
							elem.onchange =  function() {
								classes.inputIndexes(elem, legendBlock);
							};
							elem.oninput =  function() {
								classes.inputValid(elem, legendBlock);
							};
						})
						legendBlock.prepend(newLiedit);
					break;
				case 'save':
					var newLi = document.createElement('li');
						var min = item.min_max[0];
						var max = '-'+item.min_max[1];
						if(ind == lenLegend) {
							min = '>'+item.min_max[0];
							max = '';
						}
						newLi.innerHTML = '<i style="background-color: rgb('+item.color+')"></i> '+item.name+' <span>(индекс '+min+max+')</span>';
						legendBlock.prepend(newLi);
					break;
				default:
					var newLi = document.createElement('li');
						var min = item.min_max[0];
						var max = '-'+item.min_max[1];
						if(ind == lenLegend) {
							min = '>'+item.min_max[0];
							max = '';
						}
						newLi.innerHTML = '<i style="background-color: rgb('+item.color+')"></i> '+item.name+' <span>(индекс '+min+max+')</span>';
						legendBlock.prepend(newLi)
					break;
			}
		})
	},
	editGrafickChartLineTensions: function() {
		// console.log(data.getRegionInfoDate());
		let objDays = [];
		let objDaysChart = [];
		let objChart = [];
		// console.log(data.getRegionInfoDate());
		for(let region in data.getRegionInfoDate()) {
			data.getRegionInfoDate()[region].number_of_messages_by_day.map((item, ind) => {
				// console.log(item);
				if(objDays.indexOf(item.dt2) != -1) {
					for(i=0;i<=objChart.length-1;i++) {
						if(objChart[i].date == item.dt2) {
							objChart[i].value += item.value;
						}
					}
				} else {
					objDays.push(item.dt2);
					objDaysChart.push('<b>'+item.dt[0]+'</b> '+item.dt[1]);
					let obj = {
						date: item.dt2,
						dtFomat: item.dt,
						value: item.value
					}
					objChart.push(obj)
				}
				
			})
		}
		let formatChart = [];
		let prepValue = 0;
		let arrValues = [];
						
		objChart.map((item, ind) => {
			arrValues.push(item.value)
		})
		objChart.map((item, ind) => {
			let objData = []
			let obj = {
		        name: item.date,
		        color: 'rgb('+classes.gradientColor(100 - item.value * 100 / (arrValues.sort()[arrValues.length-1]) + 1)+')',
		        zIndex: objDays.length-ind,
		        data: []
		    }
		    for(i=0;i<=objDays.length-1;i++) {
		    	if(i == ind) {
		    		objData.push(item.value);
		    		if(i>0) {
		    			objData[i-1] = prepValue;
		    		}
		    	} else {
		    		objData.push(null);
		    	}
		    }
		    obj.data = objData;
		    formatChart.push(obj);
		    prepValue = item.value;
		})

		if(!data.getDatesServer().length) {
			data.setDatesServer([formatChart[0].name, formatChart[formatChart.length-1].name])
			data.setDates([formatChart[0].name, formatChart[formatChart.length-1].name])
		}

		charts.chartTensions(objDaysChart, formatChart);
	},
	generalInformationOutput: function() {
		document.querySelector('#generalInformation .items').innerHTML = "";
		config.editMode.block.map(item => {
			if(!item.disabled) {
				// console.log(item);
				let div = document.createElement('div');
					div.innerHTML = templates.typeBlock(item);
					div.id = item.id;
					expand = item.hidden ? ' expand' : '';
					filter = item.filter ? ' filter-mode' : '';
					isOpen = item.open ? ' open' : '';
					if(data.getHiddenPanel()) {
						isOpen = '';
					}
					div.classList = 'item'+expand+filter+isOpen;
					if(item.id == 'top_5_protest_initiatives') {
						div.addEventListener('click', function() {
							document.getElementById('by_the_number_of_messages').classList.add('open');
							document.getElementById('by_the_level_of_audience_engagement').classList.add('open');
						});
					}
					if(item.hidden) {
						div.querySelector('.btn-expand').addEventListener('click', function() {
							$(this).parents('.expand').toggleClass('open');
							charts.resizeTensionChartLine();
						})
					}
					if(item.filter) {
						div.querySelector('.filter').addEventListener('click', function() {
							$(this).toggleClass('is-sort');
							item.isFilter = $(this).hasClass('is-sort');
							edite.editeBlockMode(item.id);
							if(document.querySelector('#'+item.id+' .edit-options') != null) {
								document.querySelector('#'+item.id+' .edit-options').classList.remove('edit-mode-use');
							}
						})
					}
				document.querySelector('#generalInformation .items').append(div);
				edite.editeBlockMode(item.id);
			}
		})
		edite.initModeAdmin();
	},
	grafickChartLineTensions: function() {
		edite.editGrafickChartLineTensions();
	},
	editListCoutry: function() {
		// data.setGradienData([]);
		data.setRegionInfoDate([]);
		data.setSocialStat({
			reposts: [],
			likes: [],
			comments: [],
			views: []
		})
		edite.formationOfdataByRegion();
		// console.log(data.getRegionInfoDate());
		edite.buildListRegion();
		classes.getPaintRegion();
		setTimeout(function() {
			classes.preloader(false, 'Готово');
		}, 1000)
	},
	formationOfdataByRegion: function() {
		data.getDataServer().map((coutry, ind) => {
			let id_key, type;
			let dataMap = data.getMapJson();
			for(let c in dataMap[coutry.iso.substr(0, 2)]) {
				if(dataMap[coutry.iso.substr(0, 2)][c].length) {
					dataMap[coutry.iso.substr(0, 2)][c].map((item) => {
						if(item.rid == coutry.rid) {
							id_key = item.id_key;
							type = item.type;
						}
					})
				}
			}
			indexData = classes.getIndexTensions(coutry);
			indexData.id = coutry.iso;
			indexData.type = coutry.type;
			indexData.name = coutry.name; 
			indexData.flag = coutry.flag;
			indexData.gerb = coutry.gerb;
			indexData.head = coutry.head;
			indexData.latlon = coutry.lat+', '+coutry.lon;
			indexData.population = coutry.population;
			indexData.internet_percent = coutry.internet_percent;
			data.getRegionInfoDate().push(indexData);
		})
	},
	regionSortByTension: function() {
		if(data.getSort()[1]) {
			data.setSort(['tension', false]);
			data.getRegionInfoDate().sort(function(a, b){
			    return b.tension - a.tension;
			});
		} else {
			data.setSort(['tension', true]);
			data.getRegionInfoDate().sort(function(a, b){
			    return a.tension - b.tension;
			});
		}
		data.setPeriodInfoData(JSON.parse(JSON.stringify(config.periodInfoData)));
		return data.getSort()[1];
	},
	regionSortByName: function() {
		if(data.getSort()[1]) {
			data.setSort(['name', false]);
			data.getRegionInfoDate().sort(function (a, b) {
			    return a.name.localeCompare(b.name);
			});
		} else {
			data.setSort(['name', true]);
			data.getRegionInfoDate().sort(function (a, b) {
			    return b.name.localeCompare(a.name);
			});
		}
		data.setPeriodInfoData(JSON.parse(JSON.stringify(config.periodInfoData)));
		return data.getSort()[1];
	},
	buildListRegion: function() {
		switch (data.getSort()) {
			case 'tension':
				edite.regionSortByTension();
				break;
			case 'name':
				edite.regionSortByName();
				break;
			default:

				break;
		}

		contentCoutry = document.querySelector('#items-country');
		contentCoutry.innerHTML = '';
		data.getRegionInfoDate().map((value) => {
			if(data.getRidData().length) {
				// console.log(data.getRidData(), value.rid);
				if(data.getRidData().indexOf(parseInt(value.rid)) != -1) {
					prepDom(value)
				}
			} else {
				prepDom(value)
			}
		})
		function prepDom(value) {
			if(data.getFilter().indexOf(value.type) != -1) {
				// console.log(value);
				let divRegion = document.createElement('div');
					divRegion.classList.add('item-country');
					divRegion.dataset.rid = value.rid;
					divRegion.dataset.iso = value.id;
					divRegion.id = 'item-'+value.rid;
					divRegion.dataset.type = value.type;
					divRegion.innerHTML = templates.editCountry(value);
					divRegion.querySelector('.head-country').addEventListener('click', function() {
						edite.goToRegion(this.parentNode);
					})
					switch (value.type) {
						case 'country':
							flag = value.flag;
							break;
						default:
							flag = value.gerb;
							break;
					}
					if(value.rid == "142") {
						boundsData[value.rid].flag = 'https://commons.wikimedia.org/wiki/Special:FilePath/Герб_Кызыла_2016.jpg?width=100'
					} else if(value.rid == "102") {
						boundsData[value.rid].flag = 'https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_arms_of_Oryol.svg?width=100'
					} else {
						boundsData[value.rid].flag = 'https://commons.wikimedia.org/wiki/Special:FilePath/'+flag.split('/')[flag.split('/').length-1]+'?width=100'
					}
					contentCoutry.appendChild(divRegion);

					blockStat = document.querySelector('#item-'+value.rid+' .information-country .items');
					
					config.editMode.itemsCountry.map((item) => {
						if(!item.disabled) {
							let idReg = item.id+'-'+value.rid
							let divStat = document.createElement('div');
								divStat.innerHTML = templates.typeBlock(item)
								divStat.dataset.rid = value.rid
								divStat.id = idReg;
								let expand = item.hidden ? ' expand' : '';
								let filter = item.filter ? ' filter-mode' : '';
								let isOpen = item.open ? ' open' : '';
								if(data.getHiddenPanel()) {
									isOpen = '';
								}
								divStat.classList = 'item'+expand+filter+isOpen+' '+item.id;
								if(item.hidden) {
									divStat.querySelector('.btn-expand').addEventListener('click', function() {
										if($(this).parents('.expand').hasClass('open')) {
											$(this).parents('.expand').removeClass('open');
											$(this).siblings('.edit-options').removeClass('edit-mode-use');
											if(item.id == 'most_talked_about_events') {
												(saveData.getSave().newObj[idReg] != undefined) ? saveData.getSave().newObj[idReg] = {} : '';
												(saveData.getSave().editObj[idReg] != undefined) ? saveData.getSave().editObj[idReg] = {} : '';
												(saveData.getSave().deletedObj[idReg] != undefined) ? saveData.getSave().deletedObj[idReg] = {} : '';
											}
										} else {
											if(item.id == 'most_talked_about_events') {
												getData.getProjectRegionData(value.rid).then(res => {
													edite.findIndexRegion(value.rid).most_talked_about_events = res.events;
													edite.editeBlockMode(item.id+'-'+value.id, item.type, true, value.rid);
													$(this).parents('.expand').addClass('open');
												})
											} else {
												$(this).parents('.expand').addClass('open');
											}
										}
									})
								}
								if(item.filter) {
									divStat.querySelector('.filter').addEventListener('click', function() {
										$(this).toggleClass('is-sort');
										edite.editeBlockMode(item.id+'-'+value.id, item.type, true, value.rid);
										// document.querySelector('#'+item.id+'-'+value.id+' .edit-options').classList.remove('edit-mode-use');
									})
								}
								
							if(edite.findIndexRegion(value.rid)[item.id].length) {
								blockStat.append(divStat);
								// console.log(item.type);

								edite.editeBlockMode(item.id+'-'+value.id, item.type, true, value.rid);
							} else if(item.id == 'most_talked_about_events') {
								blockStat.append(divStat);
								// edite.editeBlockMode(item.id+'-'+value.id, item.type, true);
							}
						}
					})
			}		
		}
		loadItemsRid = [];
		edite.isElementVisibleLoad();
		document.getElementById('block-scroll').addEventListener("scroll", (e) => {
		    edite.isElementVisibleLoad();
		})
		edite.initModeAdmin('regions');
		classes.preloadRegion(false);
	},
	isElementVisibleLoad: function() {
	    document.querySelectorAll('#block-scroll .item-country').forEach(function(el){
	    	// console.log(item);
	    	var inViewport = edite.isElementVisible(el);
	    	if(inViewport) {
	    		if(loadItemsRid.indexOf(el.dataset.rid) == -1) {
	    			loadItemsRid.push(el.dataset.rid)
	    			// console.log(el.id);
					getData.getProjectRegionData(el.dataset.rid).then(res => {
						el.querySelector('.ico-symbol').innerHTML = '<img src="'+boundsData[el.dataset.rid].flag+'" />';
						// console.log(boundsData[el.dataset.rid].flag);
						edite.findIndexRegion(el.dataset.rid).most_talked_about_events = res.events;
						edite.editeBlockMode('most_talked_about_events-'+el.id, 'list-region', true, el.dataset.rid);
					})
	    			// console.log(el.dataset.rid);
	    		}
	    	}
	    })
	},
	isElementVisible: function(el) {
	    var bounds = el.getBoundingClientRect();
	    return (
	        (bounds.top + bounds.height > 0) && // Елемент ниже верхней границы
	        (window.innerHeight - bounds.top > 0) && // Выше нижней
	        (bounds.left + bounds.width > 0) && // Правее левой
	        (window.innerWidth - bounds.left > 0)// Левее правой
	    );
	},
	findIndexRegion: function(id) {
		let result = null;
		data.getRegionInfoDate().map((item, ind) => {
			if(item.rid == id) {
				result = item;
			}
		})
		return result;
	},
	initEventEdit: async function(element, id, rid) {
		let isRegion = false;
		if(id.split('-').length > 1) {
			isRegion = true;
		}
		// console.log(element, id, rid);
		if(isRegion) {			
			switch (element.dataset.edit) {
				case 'edit-el':
					element.parentNode.classList.add('edit-mode-use');
					document.getElementById(id).classList.add('open');
					getData.getProjectRegionData(rid).then(res => {
						edite.findIndexRegion(rid).most_talked_about_events = res.events;
						edite.editeBlockMode(id, 'edit', isRegion, rid);
					})
					break;
				case 'edit-el-save':
					element.parentNode.classList.remove('edit-mode-use');
					// console.log(saveData.getSave().newObj[id]);
					if(saveData.getSave().newObj[id] != undefined) {
						let rtr = await Promise.all(
							Object.keys(saveData.getSave().newObj[id]).map(async item => {	
								let response = await getData.saveProjectRegionEvent(saveData.getSave().newObj[id][item]);
								delete saveData.getSave().newObj[id][item];
								return response;
							})
						)
						// console.log(rtr);
					}
					if(saveData.getSave().editObj[id] != undefined) {
						let rtr = await Promise.all(
							Object.keys(saveData.getSave().editObj[id]).map(async item => {	
								let response = await getData.saveProjectRegionEvent(saveData.getSave().editObj[id][item]);
								delete saveData.getSave().editObj[id][item];
								return response;
							})
						)
						// console.log(rtr);
					}
					if(saveData.getSave().deletedObj[id] != undefined) {
						let rtr = await Promise.all(
							Object.keys(saveData.getSave().deletedObj[id]).map(async item => {	
								let response = await getData.deleteProjectRegionEvent(saveData.getSave().deletedObj[id][item]);
								delete saveData.getSave().deletedObj[id][item];
								return response;
							})
						)
						// console.log(rtr);
					}

					getData.getProjectRegionData(rid).then(res => {
						edite.findIndexRegion(rid).most_talked_about_events = res.events;
						edite.editeBlockMode(id, 'save', isRegion, rid);
						classes.preloader(false, 'Готово');
					})
					// console.log(Object.keys(saveData.getSave().newObj[id]));
					break;
				case 'edit-el-cancel':
					(saveData.getSave().newObj[id] != undefined) ? saveData.getSave().newObj[id] = {} : '';
					(saveData.getSave().editObj[id] != undefined) ? saveData.getSave().editObj[id] = {} : '';
					(saveData.getSave().deletedObj[id] != undefined) ? saveData.getSave().deletedObj[id] = {} : '';
					
					getData.getProjectRegionData(rid).then(res => {
						edite.findIndexRegion(rid).most_talked_about_events = res.events;
						edite.editeBlockMode(id, 'cancel', isRegion, rid);
						element.parentNode.classList.remove('edit-mode-use');
					})
					break;
				default:
					alert('error')
					break;
			}
		} else {
			switch (element.dataset.edit) {
				case 'edit-el':
					getData.loadProjectData().then(res => {
						data.setProjectsData(res);
						element.parentNode.classList.add('edit-mode-use');
						document.getElementById(id).classList.add('open');
						edite.editeBlockMode(id, 'edit', isRegion, rid);
					})
					break;
				case 'edit-el-save':
					if(saveData.getSave().newObj[id] != undefined) {
						if(id == 'general_conclusions') {
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().newObj[id]).map(async item => {	
									let response = await getData.saveProjectConclusion(saveData.getSave().newObj[id][item]);
									delete saveData.getSave().newObj[id][item];
									return response;
								})
							)
						} else {
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().newObj[id]).map(async item => {	
									let response = await getData.saveProjectTopProtest(saveData.getSave().newObj[id][item]);
									delete saveData.getSave().newObj[id][item];
									return response;
								})
							)
						}
					}
					if(saveData.getSave().editObj[id] != undefined) {
						if(id == 'general_conclusions') {
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().editObj[id]).map(async item => {	
									let response = await getData.saveProjectConclusion(saveData.getSave().editObj[id][item]);
									delete saveData.getSave().editObj[id][item];
									return response;
								})
							)
						} else {
							// console.log(saveData.getSave().editObj[id]);
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().editObj[id]).map(async item => {
									let response = await getData.saveProjectTopProtest(saveData.getSave().editObj[id][item]);
									delete saveData.getSave().editObj[id][item];
									return response;
								})
							)
							// console.log(rtr);
						}
					}
					if(saveData.getSave().deletedObj[id] != undefined) {
						if(id == 'general_conclusions') {
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().deletedObj[id]).map(async item => {	
									let response = await getData.deleteProjectConclusion(saveData.getSave().deletedObj[id][item]);
									delete saveData.getSave().deletedObj[id][item];
									return response;
								})
							)
						} else {
							let rtr = await Promise.all(
								Object.keys(saveData.getSave().deletedObj[id]).map(async item => {	
									let response = await getData.deleteProjectTopProtest(saveData.getSave().deletedObj[id][item]);
									delete saveData.getSave().deletedObj[id][item];
									return response;
								})
							)
						}
					}
					getData.loadProjectData().then(res => {
						data.setProjectsData(res);
						edite.editeBlockMode(id, 'save', isRegion, rid);
						element.parentNode.classList.remove('edit-mode-use');
						classes.preloader(false, 'Готово');
					})
					break;
				case 'edit-el-cancel':
					(saveData.getSave().newObj[id] != undefined) ? saveData.getSave().newObj[id] = {} : '';
					(saveData.getSave().editObj[id] != undefined) ? saveData.getSave().editObj[id] = {} : '';
					(saveData.getSave().deletedObj[id] != undefined) ? saveData.getSave().deletedObj[id] = {} : '';

					getData.loadProjectData().then(res => {
						data.setProjectsData(res);
						edite.editeBlockMode(id, 'cancel', isRegion, rid);
						element.parentNode.classList.remove('edit-mode-use');
					})
					break;
				default:
					alert('error')
					break;
			}			
		}
	},
	initModeAdmin: function(opt) {
		if(data.getUserInfo().type != 'operator') {
			if(data.getUserInfo().type == 'admin') {
				document.querySelector('.block-customization .content-block.buttons .isAdmin').innerHTML = '<a href="/admin" target="_blank"><span>Войти в панель администратора</span></a>'
			}
			switch (opt) {
				case 'regions':
					config.editMode.itemsCountry.map((item) => {
						if(item.options) {
							blockIco = document.querySelectorAll('.'+item.id+' .icons-option');
							for (var i = 0; i < blockIco.length; i++) {
								blockIco[i].prepend(edite.creatTemplate(item))
							}
						}
					})
					break;
				case 'legend':
					config.editMode.legend.map((item) => {
						if(item.options) {
							// console.log(item.id);
							blockIco = document.querySelector('#'+item.id+' .icons-option');
							blockIco.prepend(edite.creatTemplateLegend(item))
						}
					})
					break;
				default:
					config.editMode.block.map((item) => {
						if(item.options && !item.disabled) {
							// console.log(item);
							blockIco = document.querySelector('#'+item.id+' .icons-option');
							blockIco.prepend(edite.creatTemplate(item))
						}
					})
					break;
			}
		}
	},
	creatTemplate: function(item) {
		let div = document.createElement('div');
			div.classList.add('edit-options');
			div.innerHTML = templates.edit();
			div.querySelectorAll('span').forEach((el) => {
				el.dataset.edit = el.classList[0];
				el.addEventListener('click', function() {
					// console.log(item.id);
					edite.initEventEdit(el, el.parentNode.parentNode.parentNode.parentNode.parentNode.id, el.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.rid)
				})
			})
		return div;
	},
	creatTemplateLegend: function(item) {
		let div = document.createElement('div');
			div.classList.add('edit-options');
			div.innerHTML = templates.edit();
			div.querySelectorAll('span').forEach((el) => {
				el.dataset.edit = el.classList[0];
				el.addEventListener('click', function() {
					switch (el.dataset.edit) {
						case 'edit-el':
							el.parentNode.classList.add('edit-mode-use');
							edite.legendTensions('edit');
							break;
						case 'edit-el-save':
							var legendData = data.getLegendRes();
							if(legendData.length) {
								if(legendData[0]) {
									config.gradientData.map((item, ind) => {
										if(ind < legendData[1].length-1) {
											item.min_max = [legendData[1][ind], legendData[1][ind+1]];
										} else {
											item.min_max = [legendData[1][ind], 100];
										}
									})
									getData.saveProjectIndexes(legendData[1]).then(res => {
										if(res.success) {
											data.setLegendRes([]);
											getData.getUserProjects().then(res => {
												classes.preloader(true, 'Обновляю данные...');
												data.setProjects(res.projects);
												classes.setIndexes();
												el.parentNode.classList.remove('edit-mode-use');
												edite.legendTensions('save');
												edite.editListCoutry();
											})
										} else {
											alert('Что-то пошло не так...')
										}
									})
								} else {
									alert('Не верно заполнены значения!');
								}
							} else {
								el.parentNode.classList.remove('edit-mode-use');
								edite.legendTensions('save');
							}
							break;
						case 'edit-el-cancel':
							el.parentNode.classList.remove('edit-mode-use');
							edite.legendTensions('cancel');
							break;
						default:
							alert('error')
							break;
					}
				})
			})
		return div;
	},
	goToRegion: function(element) {
		// console.log(element);
		let getlatlon = false;
		let iso = element.dataset.iso;
		let feature_id = element.dataset.rid;
		let feature_type = element.dataset.type;

		let leftWidth = document.getElementsByClassName('left-panel')[0].offsetWidth;
		let rightWidth = document.getElementsByClassName('right-panel')[0].offsetWidth;
		let openRight, openLeft;

		document.querySelector('html').classList.contains('hidden-right-panel') ? openRight = rightWidth : openRight = 0;
		document.querySelector('html').classList.contains('hidden-left-panel') ? openLeft = leftWidth : openLeft = 0;

        let leftPadding = leftWidth + 50 - openLeft;
        let rightPadding = rightWidth + 50 - openRight;

        if(iso != 'RU') {
			global.foo.fitBounds(boundsData[feature_id].bbox, {
				duration: 1000,
				padding: {top: 100, bottom: 100, left: leftPadding, right: rightPadding}
			});
        } else {
			global.foo.fitBounds([19.6386, 41.1853,	190.3416, 81.8574], {
				duration: 1000,
				padding: {top: 100, bottom: 100, left: leftPadding, right: rightPadding}
			});
        }
		classes.getActiveRegion(feature_id)
	},
	serchArr: function(arr) {
		let array = [];
		search(arr);
		function search(arr) {
		  	if(typeof arr[1] == "number") {
		  		array.push(arr)
		  	}
			if(!(arr instanceof Array)) {

			} else {
				arr.some(item => search(item)); 
			}
		}
		return array;
	}

}
function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}
function getElIndex(el) {
    for (var i = 0; el = el.previousElementSibling; i++);
    return i;
}

let getSiblings = function (e) {
    let siblings = []; 
    if(!e.parentNode) {
        return siblings;
    }
    let sibling  = e.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

const findId = function (id) {
	let result = null;
	config.editMode.block.map((item, ind) => {
		if(item.id == id) {
			result = item;
		}
	})
	return result;
}
const findIdRegion = function (id) {
	let result = null;
	config.editMode.itemsCountry.map((item, ind) => {
		if(item.id == id) {
			result = item;
		}
	})
	return result;
}


module.exports = edite;