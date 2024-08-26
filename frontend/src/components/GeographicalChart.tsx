'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import geocodes from '../data/city_geocodes.json'; // Adjust the path as necessary

// Dynamically import Leaflet components since they rely on the `window` object
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface CityData {
    _id: string;
    count: number;
    lat: number;
    lon: number;
}

const GeographicalChart = () => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // Placeholder for any logic to be executed after the map loads
        if (mapLoaded) {
            console.log('Map has been loaded.');
        }
    }, [mapLoaded]);

    return (
        <div className="relative p-4 rounded-lg border border-gray-700 bg-gray-800 shadow-md h-full w-full">
            <MapContainer
                center={[37.7749, -122.4194]}  // Center of the US
                zoom={4}                        // Adjust zoom level to fit the US
                style={{ height: '100%', width: '100%' }}
                whenCreated={() => {
                    setMapLoaded(true); // Set mapLoaded to true once the map is created
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {geocodes.map((city: CityData, index: number) => (
                    <Marker key={index} position={[city.lat, city.lon]}>
                        <Popup className="custom-popup">
                            {city._id}: {city.count} orders
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <style jsx>{`
                .custom-popup {
                    background: rgba(0, 0, 0, 0.8); // Dark background for popup
                    color: #ffffff; // White text color
                    font-size: 0.8rem; // Smaller font size
                    padding: 0.5rem; // Smaller padding
                    border-radius: 5px; // Rounded corners
                    max-width: 150px; // Max width for popup
                    text-align: center; // Center align text
                }
            `}</style>
        </div>
    );
};

export default GeographicalChart ;
