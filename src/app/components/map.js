'use client';

// Import leaflet package
import * as L from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import shpjs from 'shpjs';
import vt from './vt';

// Map component
export default function MapCanvas () {
	// Geojson
	const [ geojson, setGeojson ] = useState(undefined);

	// Dialog/modal
	const popup = useRef();

	// Message and color state
	const [ message, setMessage ] = useState(undefined);
	const [ messageColor, setMessageColor ] = useState('blue');

	// Make when shapefile drop on browser, it convert to geojson
	useEffect(() => {
		window.ondragover = e => e.preventDefault();
		window.ondrop = async e => {
			e.preventDefault();

			// Try to convert shapefile to geojson
			try {
				// Set message for modal
				setMessage('Loading data...');
				setMessageColor('blue');

				// Show modal
				popup.current.showModal();

				// Get the file
				const shapefile = e.dataTransfer.files[0];

				// Convert to geojson
				const geojson = await shpjs(await shapefile.arrayBuffer());

				// Set the geojson data
				setGeojson(geojson);

				// Close the modal
				popup.current.close();
			} catch (error) {
				// Set the error message
				setMessage(error.message);
				setMessageColor('red');
			} finally {
				// Close the error after 5 seconds automatically
				setTimeout(() => popup.current.close(), 5000);
			}
		}
	}, []);
	
	return (
		<div>
			<dialog ref={popup} style={{ color: messageColor }}>
				{message}
			</dialog>

			<MapContainer id='map' center={{ lat: 0, lng: 120 }} zoom={5} maxZoom={17} minZoom={5}>
				<GeoJSONTile data={geojson} />
				<TileLayer url='http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}' attribution='Google Map' />
			</MapContainer>
		</div>
	)
}

/**
 * GeoJSON tile components
 * @param {GeoJSON} data GeoJSON object
 * @param {number} maxZoom Maximum zoom 0 - 24 for the tile
 * @param {number} minZoom Minimum zoom 0 - 24 for the tile
 * @param {number} tolerance level of simplify to the tile (1 is original), more value mean more simplify
 * @param {{ color: string, fillColor: string, weight: number }} style Style of the geojson
 * @returns {void}
 */
function GeoJSONTile({ data, maxZoom=17, minZoom=5, tolerance=5, style={ color: '#0000ff', fillColor: '#0000ff4d', weight: 1 } }) {
	// Container
	const container = useMap();
		
	// Add data to map
	useEffect(() => {
		if (data) {
			const bounds = L.geoJSON(data).getBounds();
			
			// Make it to zoom to the geojson
			container.fitBounds(bounds);
			
			// Vector data visualization parameter
			const optionsVector = {
				maxZoom: 24,
				minZoom: 0,
				maxNativeZoom: maxZoom,
				minNativeZoom: minZoom,
				tolerance,
				style
			};

			const tile = vt(data, optionsVector);
			container.addLayer(tile);

			return () => {
				container.removeLayer(tile);
			};
		}
	}, [ data ]);

	return null;
}