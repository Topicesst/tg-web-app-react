import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTelegram } from "../../hooks/useTelegram";

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
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            name,
            numberphone,
            country,
            street,
            subject
        };
        tg.sendData(JSON.stringify(data));
    }, [name, numberphone, country, street, subject, tg]);

    const handleLocationSelect = async (latlng) => {
      try {
        const addressData = await fetchAddress(latlng);
        setCountry(addressData.address.country || '');
        setStreet(`${addressData.address.road || ''}, ${addressData.address.house_number || ''}`);
        setShowMap(false); // Close map modal after selecting the location
      } catch (error) {
        console.error('Error fetching address: ', error);
      }
    };

    return (
        <div className="form">
            <h3>Enter your details:</h3>
            <input
                className="input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="input"
                type="tel"
                placeholder="Phone Number"
                value={numberphone}
                onChange={(e) => setNumberPhone(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
            <select
                className="select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            >
                <option value="physical">Physical Person</option>
                <option value="legal">Legal Person</option>
            </select>
            <button type="button" onClick={() => setShowMap(true)}>Select Location on Map</button>
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
        </div>
    );
};

export default Form;
