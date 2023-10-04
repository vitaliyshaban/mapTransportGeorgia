// const eventsDynamicElement = require('./plugins/eventsDynamicElement.js');
// const loader = require('./plugins/loader.js');
// 
// eventsDynamicElement.initAllEvents();
// loader.initSession();
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf'
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoidnNoYWJhbiIsImEiOiJjbDB1eDNkaGMwMGJqM2NxcTE2OXFvYXVzIn0.sA9rt78R--R2uGJb1pA8Og';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: [41.620198, 41.6232331], // starting position [lng, lat]
	zoom: 13 // starting zoom
});

var busIco = require('../public/images/bus-ico.png');
var busIcoRotate = require('../public/images/bus-rotate.png');

let geojsonBus;

function addPath(jsonData) {
	const route = {
		'type': 'FeatureCollection',
		'features': [
			{
				'type': 'Feature',
				'geometry': {
					'type': 'LineString',
					'coordinates': jsonData.coordinates.reverse()
				}
			}
		]
	};
//     const distance = turf.length(route);
//     console.log(distance*1000)
// 
// 	const lineDistance = turf.length(route.features[0]);
//     const steps = distance*1000;
// 	let counter = 0;
// 	const arc = [];
// 	
// 	for (let i = 0; i < lineDistance; i += lineDistance / steps) {
//         const segment = turf.along(route.features[0], i);
//         arc.push(segment.geometry.coordinates);
//     }
// 		//console.log(arc)
//     // Update the route with calculated arc coordinates
//     route.features[0].geometry.coordinates = arc;


    map.addSource('route', {
        'type': 'geojson',
        'data': route
    });
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'green',
            'line-width': 1
        }
    });

    /* ostanovki */
    const geojson = {
		'type': 'FeatureCollection',
		'features': [
		]
	};
    jsonData.busStops.map((item, i) => {
    	geojson.features.push(
	    	{
            	'id': i,
	            'type': 'Feature',
	            'properties': {
	            	'icon': 'bus'
	            },
	            'geometry': {
	                'type': 'Point',
	                'coordinates': [item.location[1], item.location[0]]
	            }
	    	}
    	)
    })
    // console.log(jsonData)
    map.addSource('busstop', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': geojson.features
        }
    });
    map.addLayer({
		'id': 'busstop',
		'type': 'symbol',
		'source': 'busstop',
		'layout': {
			'icon-image': '{icon}',
			'icon-allow-overlap': true,
			'icon-size': 1
		},
		'paint': {
			'icon-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				1,
				0.5
			]
		}
	});
	let hoveredStateId = null;
	map.on('mousemove', 'busstop', (e) => {
        if (e.features.length > 0) {
            if (hoveredStateId !== null) {
            	map.getCanvasContainer().style.cursor = 'default';
                map.setFeatureState(
                    { source: 'busstop', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            map.getCanvasContainer().style.cursor = 'pointer';
            map.setFeatureState(
                { source: 'busstop', id: hoveredStateId },
                { hover: true }
            );
        }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'busstop', () => {
        if (hoveredStateId !== null) {
        	map.getCanvasContainer().style.cursor = 'default';
            map.setFeatureState(
                { source: 'busstop', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    });

    map.loadImage(busIco, (error, image) => {
		if (error) throw error;
		 
		// Add the image to the map style.
		map.addImage('busbatumi', image);

	    map.loadImage(busIcoRotate, (error, image) => {
			if (error) throw error;
			 
			// Add the image to the map style.
			map.addImage('busbatumirotate', image);

		    geojsonBus = {
				'type': 'FeatureCollection',
				'features': [
				]
			};
		    jsonData.buses.map((item) => {
		    	geojsonBus.features.push(
			    	{
			            'type': 'Feature',
			            'properties': {
			            	icon: 'busbatumi',
			            	id: item.id,
			            	rotate: item.c
			            },
			            'geometry': {
			                'type': 'Point',
			                'coordinates': [item.lon, item.lat]
			            }
			    	}
		    	)
		    })

		    map.addSource('bus', {
		        'type': 'geojson',
		        'data': {
		            'type': 'FeatureCollection',
		            'features': geojsonBus.features
		        }
		    });
		    map.addLayer({
				'id': 'bus',
				'type': 'symbol',
				'source': 'bus',
				'layout': {
					'icon-image': 'busbatumi',
					'icon-allow-overlap': true,
					'icon-size': 0.25,
					'icon-rotation-alignment': 'map',
					'icon-allow-overlap': true,
					'icon-ignore-placement': true
				}
			});


		    map.addLayer({
				'id': 'busrotate',
				'type': 'symbol',
				'source': 'bus',
				'layout': {
					'icon-image': 'busbatumirotate',
					'icon-allow-overlap': true,
					'icon-size': 0.25,
					'icon-rotation-alignment': 'map',
					'icon-allow-overlap': true,
					'icon-ignore-placement': true,
					"icon-rotate": ["get", "rotate"]
				}
			});
		    setInterval(()=> {
		    	updateBusCoordinate();
		    }, 2000);
		})
	})
    // Add a circle layer


// 	const point = {
// 		'type': 'FeatureCollection',
// 		'features': [
// 			{
// 				'type': 'Feature',
// 				'properties': {},
// 				'geometry': {
// 					'type': 'Point',
// 					'coordinates': [41.6095567009, 41.6340597298]
// 				}
// 			}
// 		]
// 	};
// 	map.addSource('point', {
// 		'type': 'geojson',
// 		'data': point
// 	});
// 	map.addLayer({
// 		'id': 'point',
// 		'source': 'point',
// 		'type': 'symbol',
// 		'layout': {
// 			'icon-image': 'airport-15',
// 			'icon-rotate': ['get', 'bearing'],
// 			'icon-rotation-alignment': 'map',
// 			'icon-allow-overlap': true,
// 			'icon-ignore-placement': true,
// 			'icon-size': 1.5
// 		}
// 	});
// 
//     function animate() {
//         const start =
//             route.features[0].geometry.coordinates[
//                 counter >= steps ? counter - 1 : counter
//             ];
//         const end =
//             route.features[0].geometry.coordinates[
//                 counter >= steps ? counter : counter + 1
//             ];
//         if (!start || !end) return;
// 
//         // Update point geometry to a new position based on counter denoting
//         // the index to access the arc
//         point.features[0].geometry.coordinates =
//             route.features[0].geometry.coordinates[counter];
// 
//         // Calculate the bearing to ensure the icon is rotated to match the route arc
//         // The bearing is calculated between the current point and the next point, except
//         // at the end of the arc, which uses the previous point and the current point
//         point.features[0].properties.bearing = turf.bearing(
//             turf.point(start),
//             turf.point(end)
//         );
// 
//         // Update the source with this new data
//         map.getSource('point').setData(point);
// 
//         // Request the next frame of animation as long as the end has not been reached
//         if (counter < steps) {
//         	setTimeout(() => {
// 				// console.log(new Date());
//             	requestAnimationFrame(animate);
//         	}, 1000)
//         }
// 
//         counter = counter + 1;
//     }

//     document.getElementById('replay').addEventListener('click', () => {
//         // Set the coordinates of the original point back to origin
//         point.features[0].geometry.coordinates = origin;
// 
//         // Update the source layer
//         map.getSource('point').setData(point);
// 
//         // Reset the counter
//         counter = 0;
// 
//         // Restart the animation
//         animate(counter);
//     });

    // Start the animation
    // animate(counter);
    /* buses */

	map.on('click', 'bus', function(e) {
		console.log(e.features[0].properties.id)
	})
	map.on('click', function(e) {
		console.log(e)
	})
}



function updateBusCoordinate() {
	getPositionBus("5ed60865340f60873ff9e1bf").then((res) => {
		if(res.data.buses.length > 0) {
			// console.log(res.data.buses[0].id, res.data.buses[0].c, res.data.buses[0].s)
			geojsonBus.features = []
			res.data.buses.map((bus) => {
				geojsonBus.features.push({
		            'type': 'Feature',
		            'properties': {
		            	icon: 'busbatumi',
		            	id: bus.id,
		            	rotate: bus.c
		            },
		            'geometry': {
		                'type': 'Point',
		                'coordinates': [bus.lon, bus.lat]
		            }
		    	})
			})
			map.getSource('bus').setData(geojsonBus);
		}
	});
}

map.on('load', () => {
	getPositionBus("5ed60865340f60873ff9e1bf").then((res) => {
		addPath(res.data)
	});
});

// http://transport.geogps.ge/get-live-bus-stop-time

// {
//     "routeId": "5ed60715340f60873ff9e1bd"
// }


// coordinates

async function getPositionBus(id) {
  try {
  	// console.log(region)
    return await axios( 
    	{
			method: 'get',
		    url: `http://116.203.146.71:9000/getBuses`,
			headers: {
				"Content-Type": "application/json"
			}
    	}
    );
  } catch (error) {
    console.error(error);
  }
}
// setInterval(() => {
	// getPositionBus("60acde9ffcc7a224160c587c").then((res) => {
	// 	console.log(res.data)
	// });
// }, 1000)
