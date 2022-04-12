const classes = require('./classes.js');
const data = require('./data.js');

const templates = {
	typeBlock: function(data) {
		expandIco = data.hidden ? '<span class="btn-expand">'+require('../../public/kribrum/images/icons/panel/ico-expand.svg')+'</span>' : '';
		filterIco = data.filter ? '<div class="filter">'+require('../../public/kribrum/images/icons/panel/ico-filter.svg')+'</div>' : '';
		typeData = (data.type == 'numb' || data.type == 'title') ? '' : '<div class="content-block '+data.type+'"><div class="no-events"><span>Нет данных</span></div></div>';

		template = '<div class="head-block">'+
						filterIco +
          				'<div class="title">'+data.title+'</div>'+
      					'<div class="r-bl">'+
      						'<div class="num"></div>'+
          					'<div class="icons-option">'+expandIco+'</div>'+
      					'</div>'+
    				'</div>' + typeData;
			return template;
	},
	edit: function(template) {
		var editelcancel = require('../../public/kribrum/images/icons/panel/ico-no.svg');
		var editelsave = require('../../public/kribrum/images/icons/panel/ico-ok.svg');
		var editel = require('../../public/kribrum/images/icons/panel/ico-edit.svg');

		template = 	'<span class="edit-el-cancel edit-mode">'+editelcancel+'</span>'+
					'<span class="edit-el-save edit-mode ">'+editelsave+'</span>'+
					'<span class="edit-el">'+editel+'</span>'
		return template;
	},
	editList: function(option, mode) {
		var deletedIco = '';
		if(mode) {
			deletedIco = '<i class="deleted">'+require('../../public/kribrum/images/icons/panel/ico-deleted.svg')+'</i>';
		}
		template = '<textarea rows="'+option.type_edit.rows+'"></textarea>'+deletedIco;
		return template;
	},
	editCountry: function(option) {
		template = '<div class="head-country">'+
              			'<div class="ico-symbol"></div>'+
              			'<div class="descr-country">'+
		                    // '<div class="a">Ближнее зарубежье</div>'+
		                    '<div class="name">'+option.name+'</div>'+
	                  	'</div>'+
              			'<div class="icons-option"></div>'+
            		'</div>'+
            		'<div class="information-country">'+
						'<ul>'+
							'<li> <span>Индекс напряженности</span><b class="index" style="background-color: rgb('+option.color+');"><i>'+option.tension+'</i></b></li>'+
							'<li> <span>Население</span><b>'+option.population+'</b></li>'+
							'<li> <span>Доля интернет-пользователей</span><b>'+option.internet_percent+'%</b></li>'+
							'<li> <span>Глава региона</span><b>'+option.head+'</b></li>'+
						'</ul>'+
              			'<div class="items"></div>'+
            		'</div>';
		return template;
	}
}
function checkImage(imageSrc) {
	const cyrillicPattern = /[а-яА-ЯЁё]/;
	return cyrillicPattern.test(imageSrc)
}

module.exports = templates;