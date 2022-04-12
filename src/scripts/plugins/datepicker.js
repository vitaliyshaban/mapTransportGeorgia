const Lightpick = require('lightpick');
const moment = require('moment');
const data = require('./data.js');

let picker, picker2;
const datepicker = {
	initDatepicker: function() {
		picker = new Lightpick({
			field: document.getElementById('datepicker'),
			parentEl: '#app',
			singleDate: false,
			format: 'YYYY-MM-DD',
			maxDays: 7,
			minDate: data.intF1(new Date(data.getDates()[0]), 7),
    		maxDate: data.getDates()[1],
    		locale: {
    			tooltip: {
				    one: 'день',
		            few: 'дня',
		            many: 'дней'
			  	},
	  	        pluralize: function(i, locale) {
		            if ('one' in locale && i % 10 === 1 && !(i % 100 === 11)) return locale.one;
		            if ('few' in locale && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return locale.few;
		            if ('many' in locale && (i % 10 === 0 || i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)) return locale.many;
		            if ('other' in locale) return locale.other;
		    
		            return '';
		        }
			},
		    onSelect: function(start, end) {
		        data.setDates([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
		    },
		    onClose: function(start, end) {
		    	if(this._opts.endDate == null) {
		        	picker2.setDateRange(data.getDates()[0], data.getDates()[0]);
		        	picker.setDateRange(data.getDates()[0], data.getDates()[0]);
		        	data.setDates([data.getDates()[0], data.getDates()[0]]);
		    	} else {
		        	picker2.setDateRange(data.getDates()[0], data.getDates()[1])
		    	}
		    },
		    onOpen: function(a, b) {
		    	$(this.el).css('width', this._opts.field.offsetWidth);
		    }
		});

		picker2 = new Lightpick({
			field: document.getElementById('datepicker2'),
			parentEl: '#app',
			singleDate: false,
			format: 'YYYY-MM-DD',
			maxDays: 7,
			minDate: data.intF1(new Date(data.getDates()[0]), 7),
    		maxDate: data.getDates()[1],
    		locale: {
    			tooltip: {
				    one: 'день',
		            few: 'дня',
		            many: 'дней'
			  	},
	  	        pluralize: function(i, locale) {
		            if ('one' in locale && i % 10 === 1 && !(i % 100 === 11)) return locale.one;
		            if ('few' in locale && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return locale.few;
		            if ('many' in locale && (i % 10 === 0 || i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)) return locale.many;
		            if ('other' in locale) return locale.other;
		    
		            return '';
		        }
			},
		    onSelect: function(start, end) {
		        data.setDates([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
		    },
		    onClose: function() {
		    	if(this._opts.endDate == null) {
		        	picker.setDateRange(data.getDates()[0], data.getDates()[0]);
		        	picker2.setDateRange(data.getDates()[0], data.getDates()[0]);
		        	data.setDates([data.getDates()[0], data.getDates()[0]]);
		    	} else {
		        	picker.setDateRange(data.getDates()[0], data.getDates()[1])
		    	}
		    },
		    onOpen: function(a, b) {
		    	$(this.el).css('width', this._opts.field.offsetWidth);
		    }
		});
		data.setDatesAllList(data.getDaysArray(new Date(data.getDates()[0]), new Date(data.getDates()[1])));
		datepicker.updateDates();
	},
	updateDates: function() {
		picker.setDateRange(data.getDates()[0], data.getDates()[1])
		picker2.setDateRange(data.getDates()[0], data.getDates()[1])
	}
}

module.exports = datepicker;