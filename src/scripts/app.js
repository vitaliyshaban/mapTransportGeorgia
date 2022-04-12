// const eventsDynamicElement = require('./plugins/eventsDynamicElement.js');
// const loader = require('./plugins/loader.js');
// 
// eventsDynamicElement.initAllEvents();
// loader.initSession();
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoidnNoYWJhbiIsImEiOiJjbDB1eDNkaGMwMGJqM2NxcTE2OXFvYXVzIn0.sA9rt78R--R2uGJb1pA8Og';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: [41.620198, 41.6232331], // starting position [lng, lat]
	zoom: 13 // starting zoom
});

let geojsonBus;

function addPath(jsonData) {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': jsonData.coordinates
            }
        }
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
            'line-color': 'red',
            'line-width': 1
        }
    });

    /* ostanovki */
    const geojson = {
		'type': 'FeatureCollection',
		'features': [
		]
	};
    jsonData.busStops.map((item) => {
    	geojson.features.push(
	    	{
	            'type': 'Feature',
	            'properties': {},
	            'geometry': {
	                'type': 'Point',
	                'coordinates': [item.location[1], item.location[0]]
	            }
	    	}
    	)
    })
    console.log(jsonData)
    map.addSource('points', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': geojson.features
        }
    });
    // Add a circle layer
    map.addLayer({
        'id': 'circle',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 4,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

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
	            	id: item.id
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
    // Add a circle layer
    map.addLayer({
        'id': 'bus',
        'type': 'circle',
        'source': 'bus',
        'paint': {
            'circle-color': 'red',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'blue'
        }
    });

    /* buses */


    setInterval(()=> {
    	updateBusCoordinate();
    	// console.log(map.getFeatureState({ id: '5f919191043b05375954538e', source: "bus" }));
    	// geojson.features[2].geometry.coordinates = [41.620198, 41.6232331];
    	// // console.log(geojson.features[2].geometry.coordinates)
    	// map.getSource('points').setData(geojson);
    }, 5000);
}



function updateBusCoordinate() {
	getPositionBus("5ed608b7340f60873ff9e1c0").then((res) => {
		// console.log(res.data)
		geojsonBus.features = []
		res.data.buses.map((bus) => {
			geojsonBus.features.push({
	            'type': 'Feature',
	            'properties': {
	            	id: bus.id
	            },
	            'geometry': {
	                'type': 'Point',
	                'coordinates': [bus.lon, bus.lat]
	            }
	    	})
		})
		map.getSource('bus').setData(geojsonBus);
	});
}

map.on('load', () => {
	getPositionBus("5ed608b7340f60873ff9e1c0").then((res) => {
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
		    url: `http://localhost:9000/getBuses`,
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
