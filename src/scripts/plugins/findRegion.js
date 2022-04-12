const autocomplete = require('webpack-jquery-ui/autocomplete.js');
const data = require('./data.js');
// const edite = require('./edite.js');
// const events = require('./events.js');

const findRegion = {
	findReg: function(elem) {
		$(elem).autocomplete({
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
			search: function( event, ui ) {
			},
			select: function( event, ui ) {
			}
		});

	}

}


module.exports = findRegion;