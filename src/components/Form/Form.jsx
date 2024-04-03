import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const fetchAddress = async (latlng) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
  if (!response.ok) {
    throw new Error('Failed to fetch address');
  }
  const data = await response.json();
  return data;
};

const Form = () => {
    const [name, setName] = useState('');
    const [numberphone, setNumberPhone] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const [showMap, setShowMap] = useState(false);

    const handleLocationSelect = async (latlng) => {
      try {
        const addressData = await fetchAddress(latlng);
        setCountry(addressData.address.country || '');
        setStreet(`${addressData.address.road || ''}, ${addressData.address.house_number || ''}`);
        setShowMap(false);
      } catch (error) {
        console.error('Error fetching address: ', error);
      }
    };

    return (
        <div className="form">
            <h3>Enter your details:</h3>
            {/* Input fields */}
            <button type="button" onClick={() => setShowMap(true)}>Select Location</button>
            {showMap && (
                <div className="map-modal">
                    <MapContainer center={[50.4501, 30.5234]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                    </MapContainer>
                    <button type="button" onClick={() => setShowMap(false)}>Close Map</button>
                </div>
            )}
            {/* Other form elements */}
        </div>
    );
};

export default Form;
