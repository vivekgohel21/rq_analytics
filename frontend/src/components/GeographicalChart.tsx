'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { LatLng, LatLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS for map styling

// Import geocodes from your local file or adjust the path accordingly
import geocodes from '../data/city_geocodes.json'; // Adjust the path as necessary

interface CityData {
    _id: string;
    count: number;
}

interface Geocode {
    _id: string;
    lat: number;
    lon: number;
}

const GeographicalChart: React.FC = () => {
    const [citiesData, setCitiesData] = useState<{ city: string; count: number; lat: number; lon: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/geographical-distribution');
                const apiData: CityData[] = response.data;

                const combinedData = apiData.map((cityData) => {
                    const geocode = geocodes.find(geocode => geocode._id === cityData._id);
                    if (geocode) {
                        return {
                            city: cityData._id,
                            count: cityData.count,
                            lat: geocode.lat,
                            lon: geocode.lon
                        };
                    }
                    return null;
                }).filter((data): data is { city: string; count: number; lat: number; lon: number } => data !== null);

                setCitiesData(combinedData);
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="relative p-4 rounded-lg border border-gray-700 bg-gray-800 shadow-md h-full w-full">
            <MapContainer
                center={[37.7749, -122.4194]}  // Center of the US
                zoom={4}                        // Adjust zoom level to fit the US
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {citiesData.map((city, index) => (
                    <Marker key={index} position={[city.lat, city.lon]}>
                        <Popup>
                            <div className="custom-popup">
                                {city.city}: {city.count} orders
                            </div>
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

export default GeographicalChart;
