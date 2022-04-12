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
    console.log(geojson)
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

    setTimeout(()=> {
    	geojson.features[2].geometry.coordinates = [41.620198, 41.6232331];
    	// console.log(geojson.features[2].geometry.coordinates)
    	map.getSource('points').setData(geojson);
    }, 5000);
}


map.on('load', () => {
	getPositionBus("5ed608b7340f60873ff9e1c0").then((res) => {
		console.log(res.data)
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
			method: 'post',
			headers: {
				// 'Content-Type': 'application/x-www-form-urlencoded'
				// 'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json; charset=UTF-8',
				// 'Host': 'transport.geogps.ge',
				// 'Origin': 'http://transport.geogps.ge',
				// 'Referer': 'http://transport.geogps.ge/live-bus-stop-time',
			},
			proxy: {
				host: 'batauto.ge'
			},
		    url: `http://transport.geogps.ge/get-live-bus-stop-time`,
    		params: {
    			routeId: id
    		},
    		crossdomain: true,
    		withCredentials: false
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
