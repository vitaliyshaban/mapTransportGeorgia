const config = require('../../public/kribrum/json/config.json');
const slider = require('webpack-jquery-ui/slider.js');
const classes = require('./classes.js');
require('jquery-ui-touch-punch');

const sliders = {
	sliderGradient: function() {

		$( "#slider-range" ).slider({
			range: true,
			min: 1,
			max: 100,
			values: [ 1, 100 ],
			stop: function(event, ui) {
		        classes.getFilterSlider(ui.values); 
			},
			create: function( event, ui ) {
				$(this).parents('.slider-gradient').css({
					'background':  'linear-gradient(to right, rgb('+config.gradient[0][1].join()+') '+config.gradient[0][0]+'%, rgb('+config.gradient[1][1].join()+') '+config.gradient[1][0]+'%, rgb('+config.gradient[2][1].join()+') '+config.gradient[2][0]+'%, rgb('+config.gradient[3][1].join()+') '+config.gradient[3][0]+'%)'
				})
				$('.ui-slider-handle', this).eq(1).html('<i>min</i>');
				$('.ui-slider-handle', this).eq(0).html('<i>max</i>');
			}
		});
	}
}

module.exports = sliders;