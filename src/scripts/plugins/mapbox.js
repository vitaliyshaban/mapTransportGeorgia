const config = require('../../public/kribrum/json/config.json');
const mapboxgl = require('mapbox-gl');

const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const data = require('./data.js');
const datepicker = require('./datepicker.js');

const classes = require('./classes.js');
const edite = require('./edite.js');

const mapBox = {
	initMap: function() {
		classes.preloader(true, 'Гружу карту');
		mapboxgl.accessToken = config.mapbox.token;

		let map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: config.mapbox.positionMap,
			minZoom: 1
		});
		global.foo = map;
		map.on('load', function() {
			map.setLayoutProperty('water-point-label', 'visibility', 'none');
			map.setLayoutProperty('water-line-label', 'visibility', 'none');
			map.setLayoutProperty('state-label', 'visibility', 'none');
			map.setLayoutProperty('road-label', 'visibility', 'none');
			map.setLayoutProperty('country-label', 'text-field', [
				'get',
				'name_ru'
			]);
			map.setLayoutProperty('settlement-label', 'text-field', [
				'get',
				'name_ru'
			]);
			map.setLayerZoomRange('settlement-label', 1, 10);

			var canvas = map.getCanvasContainer();

			map.addSource('a0', {
				type: 'vector',
        url: config.mapbox.countryTileset
			});
			map.addSource('a1', {
				type: 'vector',
        url: config.mapbox.regionTileset
			});
			map.addSource('a2', {
				type: 'vector',
        url: config.mapbox.cityTileset
			});


			const layerMap = {
				'country': 'adm0',
				'region': 'adm1',
				'city': 'adm2'
			}
			const layerMapA = {
				'country': 'a0',
				'region': 'a1',
				'city': 'a2'
			}

			var dataIsoArr = []

			async function loadDataJson() {
				await loadCoutry();
			}

			async function loadCoutry() {
			}

		    loadDataJson().then(v => {
		    	// console.log(data.getMapJson());
				var worldviewFilterCountry = ['in', 'rid'];
				var worldviewFilterRegion = ['in', 'rid']
				var worldviewFilterPlace = ['in', 'rid'];

		    	data.getDataServer().map((item) => {
		    		// console.log(item.type);
		    		switch (item.type) {
		    			case 'country':
		    					worldviewFilterCountry.push(item.rid);
		    				break;
		    			case 'region':
		    					worldviewFilterRegion.push(item.rid);
		    				break;
		    			case 'city':
		    					worldviewFilterPlace.push(item.rid);
		    				break;
		    			default:
		    				console.log('что-то лишнее');
		    				break;
		    		}
		    	})
		    	worldviewFilterRegion.push("");
				map.addLayer({
					id: 'a0-fill',
					type: 'fill',
					source: 'a0',
					'source-layer': 'country',
					filter: worldviewFilterCountry,
					paint: {
						'fill-color': 'rgb(255,255,255)'
					},
				},
				'settlement-label');
				map.addLayer({
					id: 'a1-fill',
					type: 'fill',
					source: 'a1',
					'source-layer': 'region',
					filter: worldviewFilterRegion,
					layout: {
					},
					paint: {
						'fill-color': 'rgb(255,255,255)'
					}
				},
				'settlement-label');

				map.addLayer({
					id: 'a2-fill',
					type: 'fill',
					source: 'a2',
					'source-layer': 'city',
					filter: worldviewFilterPlace,
					paint: {
						'fill-color': 'rgb(255,255,255)'
					},
				},
				'settlement-label');


				map.addLayer({
					id: 'a1-line',
					type: 'line',
					source: 'a1',
					'source-layer': 'region',
					filter: worldviewFilterRegion,
					paint: {
						'line-color': 'rgba(170, 170, 170, 0.5)',
						'line-width': 1,
					},
				},
				'settlement-label');

				map.addLayer({
					id: 'a2-line',
					type: 'line',
					source: 'a2',
					'source-layer': 'city',
					filter: worldviewFilterPlace,
					paint: {
						'line-color': 'rgba(170, 170, 170, 1)',
						'line-width': 1,
					},
				},
				'settlement-label');
				
				map.addLayer({
					id: 'a0-line',
					type: 'line',
					source: 'a0',
					'source-layer': 'country',
					filter: worldviewFilterCountry,
					paint: {
						'line-color': '#a2a2a2',
						'line-width': 2,
					},
				},
				'settlement-label');

				map.addLayer({
					id: 'a1-select',
					type: 'line',
					source: 'a1',
					'source-layer': 'region',
					filter: ['in', 'rid', 'none'],
					'paint': {
						'line-color': 'red',
						'line-width': 2
					}
				},
				'settlement-label');

				map.addLayer({
					id: 'a2-select',
					type: 'line',
					source: 'a2',
					'source-layer': 'city',
					filter: ['in', 'rid', ''],
					'paint': {
						'line-color': 'red',
						'line-width': 2
					}
				},
				'settlement-label');
				
				map.addLayer({
					id: 'a0-select',
					type: 'line',
					source: 'a0',
					'source-layer': 'country',
					filter: ['in', 'rid', ''],
					'paint': {
						'line-color': 'red',
						'line-width': 2,
					}
				},
				'settlement-label');

				
				edite.editListCoutry();
				edite.grafickChartLineTensions();

				edite.generalInformationOutput();
				edite.legendTensions();
				edite.initModeAdmin('legend');
				datepicker.initDatepicker();
				// findRegion.find();
				mapBox.newGeocoder();
				mapBox.addControlMap()
				classes.preloader(false, 'Карта загружена');
				classes.getAuthData(true);
		    });
			canvas.addEventListener('click', mouseDown, true);

			function mouseDown(e) {
				var features = map.queryRenderedFeatures([e.x, e.y]);
				// console.log(features);
				var sourceObj = null;
				map.setFilter('a0-select', ['in', 'rid', 'none']);
				map.setFilter('a1-select', ['in', 'rid', 'none']);
				map.setFilter('a2-select', ['in', 'rid', 'none']);
				features.map((item) => {
					if(sourceObj == null) {
						switch (item.layer.source) {
							case layerMapA.city:
									sourceObj = item;
								break;
							case layerMapA.region:
									sourceObj = item;
								break;
							case layerMapA.country:
									sourceObj = item;
								break;
							default:
								break;
						}
					}
				})
			}
			map.on('zoom', function () {
				let opacity = 1;
				if(map.getZoom() > 7) {
					opacity = 0.3;
				} else {
					opacity = 1;
				}
				map.setPaintProperty("a0-fill", "fill-opacity", opacity);
				map.setPaintProperty("a1-fill", "fill-opacity", opacity);
				map.setPaintProperty("a2-fill", "fill-opacity", opacity);
			});
  		});
	},
	addControlMap: function() {
		let controlMap = new mapboxgl.NavigationControl();
	    global.foo.addControl(controlMap, "bottom-right");
	    global.foo.addControl(new PitchToggle({ bearing: 0, pitch: 45 }), "bottom-right");
	},
	newGeocoder: function() {
	    var coordinatesGeocoder = function (query) {
	        // Match anything which looks like
	        // decimal degrees coordinate pair.
	        var matches = query.match(
	            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
	        );
	        if (!matches) {
	            return null;
	        }

	        function coordinateFeature(lng, lat) {
	            return {
	                center: [lng, lat],
	                geometry: {
	                    type: 'Point',
	                    coordinates: [lng, lat]
	                },
	                place_name: 'Lat: ' + lat + ' Lng: ' + lng,
	                place_type: ['coordinate'],
	                properties: {},
	                type: 'Feature'
	            };
	        }

	        var coord1 = Number(matches[1]);
	        var coord2 = Number(matches[2]);
	        var geocodes = [];

	        if (coord1 < -90 || coord1 > 90) {
	            geocodes.push(coordinateFeature(coord1, coord2));
	        }

	        if (coord2 < -90 || coord2 > 90) {
	            geocodes.push(coordinateFeature(coord2, coord1));
	        }

	        if (geocodes.length === 0) {
	            geocodes.push(coordinateFeature(coord1, coord2));
	            geocodes.push(coordinateFeature(coord2, coord1));
	        }
	        return geocodes;
	    };

        let geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            localGeocoder: coordinatesGeocoder,
            zoom: 8,
            placeholder: '',
            mapboxgl: mapboxgl,
            reverseGeocode: true
        })
	    global.foo.addControl(geocoder);
	    global.bar = geocoder;	    
	},
	initGeocoder: function() {
	    var coordinatesGeocoder = function (query) {
	        var matches = query.match(
	            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
	        );
	        if (!matches) {
	            return null;
	        }

	        function coordinateFeature(lng, lat) {
	            return {
	                center: [lng, lat],
	                geometry: {
	                    type: 'Point',
	                    coordinates: [lng, lat]
	                },
	                place_name: 'Lat: ' + lat + ' Lng: ' + lng,
	                place_type: ['coordinate'],
	                properties: {},
	                type: 'Feature'
	            };
	        }

	        var coord1 = Number(matches[1]);
	        var coord2 = Number(matches[2]);
	        var geocodes = [];

	        if (coord1 < -90 || coord1 > 90) {
	            // must be lng, lat
	            geocodes.push(coordinateFeature(coord1, coord2));
	        }

	        if (coord2 < -90 || coord2 > 90) {
	            // must be lat, lng
	            geocodes.push(coordinateFeature(coord2, coord1));
	        }

	        if (geocodes.length === 0) {
	            // else could be either lng, lat or lat, lng
	            geocodes.push(coordinateFeature(coord1, coord2));
	            geocodes.push(coordinateFeature(coord2, coord1));
	        }
	        // console.log(geocodes);
	        return geocodes;
	    };

		let geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            localGeocoder: coordinatesGeocoder,
            zoom: 4,
            placeholder: '',
            mapboxgl: mapboxgl,
            reverseGeocode: true
		});
		global.bar = geocoder;
		geocoder.addTo('#geocoder');
	}
}

class PitchToggle {
  constructor({ bearing = -20, pitch = 70, minpitchzoom = null }) {
    this._bearing = bearing;
    this._pitch = pitch;
    this._minpitchzoom = minpitchzoom;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
    this._btn.type = "button";
    this._btn["aria-label"] = "Toggle Pitch";
    this._btn.onclick = function() {
      if (map.getPitch() === 0) {
        let options = { pitch: _this._pitch, bearing: _this._bearing };
        if (_this._minpitchzoom && map.getZoom() > _this._minpitchzoom) {
          options.zoom = _this._minpitchzoom;
        }
        map.easeTo(options);
        _this._btn.className =
          "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d";
      } else {
        map.easeTo({ pitch: 0, bearing: 0 });
        _this._btn.className =
          "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
      }
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

module.exports = mapBox;