const Highcharts = require('highcharts');
const data = require('./data.js');
const classes = require('./classes.js');

let chartLine = [], chartGraf;
const charts = {
	chartLine: function(id, data) {
		chartLine[id] = Highcharts.chart(id+'-chart', {
			credits: {
				enabled: false
			},
		    chart: {
		        type: 'line',
		        backgroundColor: 'transparent',
		        style: {
		            fontFamily: 'Roboto',
		            fontSize: '1em'
		        }
		    },
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},

			yAxis: {
				title: {
					text: ''
				},
				tickPixelInterval: 35,
				labels: {
					style: {
						fontSize: '0.8em'
					}
				}
			},

			xAxis: {
				visible: false,
				accessibility: {
					rangeDescription: ''
				}
			},

			legend: {
				enabled: false,
			},

			plotOptions: {
		        line: {
		        	lineWidth: 1,
					color: '#004650',
		        	marker: {
		        		enabled: true,
		        		symbol: 'circle',
		        		fillColor: '#004650',
		        		lineColor: null,
		        		lineWidth: 0,
		        		radius: 2
		        	}
		        },
			    series: {
					enableMouseTracking: false,
					label: {
						enabled: false
					}
				}
			},
			series: data,
		});
	},
	resizeTensionChartLine: function() {
		for (var chart in chartLine) {
			chartLine[chart].reflow();
		}
	},
	resizeTensionChart: function() {
		chartGraf.reflow();
	},
	chartTensions: function(objDays, formatChart) {
		chartGraf = Highcharts.chart('chartTensions', {
		    chart: {
		        type: 'line',
		        backgroundColor: 'transparent',
		        style: {
		            fontFamily: 'Roboto',
		            fontSize: '1em'
		        },
		        events: {
		        	load: function() {
		        	}
		        }
		    },
			credits: {
				enabled: false
			},
		    title: {
		        text: ''
		    },
			legend: {
				enabled: false,
			},
		    subtitle: {
		        text: ''
		    },
		    xAxis: {
		    	labels: {
		    		useHTML: true,
		    		// rotation: 0,
		    		autoRotation: [0,-90],
		    		formatter: function(a) {		    			
		    			cl = ''
		    			if(a.pos == 3) {
		    				cl = 'active'
		    			}
		    			// this.date = formatChart[a.pos].date;
		    			var tick = this.axis.ticks[this.pos]
				        var chart = this.chart
				        var tooltip = chart.tooltip
				        
				        if (tick) {
				           	tick.label.element.onclick = function() {
				           		classes.getPaintRegionDay(chart.series[tick.pos].name);
				           		$(this).toggleClass('active').siblings().removeClass('active');
				           		if(!$(this).hasClass('active')) {
				           			classes.getPaintRegion();
				           		}
				           	}
				        } 
				        // return this.value
		    			return this.value
		    		},
		    		style: {
		    			color: '#ffffff',
		    			fontSize: '0.9em',
		    			backgroundColor: '#004650',
		    			borderRadius: '4px',
		    			padding: '4px',
		    			fontWeight: '300'
		    		}
		    	},
		        categories: objDays
		    },
		    yAxis: {
		    	tickInterval: 700000,
		    	visible: false,
		        title: {
		            text: ''
		        }
		    },
		    plotOptions: {
		        line: {
		        	lineWidth: 1,
		        	marker: {
		        		enabled: true,
		        		symbol: 'circle',
		        		fillColor: '#ffffff',
		        		lineColor: null,
		        		lineWidth: 2,
		        		radius: 2
		        	},
		        	label: {
		        		enabled: true
		        	},
		            enableMouseTracking: false,
		        	dataLabels: {
			            enabled: true,     
		            	borderWidth: 1,
		            	borderColor: '#505050',
		            	backgroundColor: 'rgba(255, 255, 255, 0.5)',
		            	padding: 3,
		            	align: 'center',
		            	position: 'center',
		            	y: -6,
		            	verticalAlign: 'bottom',
			            style: {
			            	fontWeight: '500',
			            	fontSize: '0.7em',
			            }
			        },
		        }
		    },
		    series: formatChart
		});
	}

}

module.exports = charts;